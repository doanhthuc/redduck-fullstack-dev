import { PostsDocument, usePostsQuery } from '../generated/graphql';
import { addApolloState, initializeApollo } from '../lib/apolloClient';
import {
    Box,
    Button,
    Flex,
    Heading,
    Link,
    Spinner,
    Stack,
    Text,
} from '@chakra-ui/react';
import React from 'react';
import NextLink from 'next/link';
import Layout from '../components/Layout';
import PostEditDeleteButton from '../components/PostEditDeleteButton';
import { NetworkStatus } from '@apollo/client';
import UpVoteSection from '../components/UpVoteSection';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';

export const limit = 3;

const Index = () => {
    const { data, loading, fetchMore, networkStatus } = usePostsQuery({
        variables: { limit },
        //Component nao render boi cai Posts query nay, se re-render khi netWorkStatus thay doi, tuc la fetchMore
        notifyOnNetworkStatusChange: true,
    });

    const isLoadingMorePosts = networkStatus === NetworkStatus.fetchMore;

    const loadMorePosts = () =>
        fetchMore({ variables: { cursor: data?.posts?.cursor } });

    return (
        <Layout>
            {loading && !isLoadingMorePosts ? (
                <Flex justifyContent='center' alignItems='center' minH='100vh'>
                    <Spinner />
                </Flex>
            ) : (
                <Stack spacing={8}>
                    {data?.posts?.paginatedPosts.map((post) => (
                        <Flex key={post.id} p={5} shadow='md' borderWidth='1px'>
                            <UpVoteSection post={post} />
                            <Box flex={1}>
                                <NextLink href={`/post/${post.id}`}>
                                    <Link>
                                        <Heading fontSize='xl'>
                                            {post.title}
                                        </Heading>
                                    </Link>
                                </NextLink>
                                <Text>posted by: {post.user.username}</Text>
                                <Flex align='center'>
                                    <Text mt={4}>{post.textSnippet}</Text>
                                    <Box ml='auto'>
                                        <PostEditDeleteButton
                                            postId={post.id}
                                            postUserId={post.user.id}
                                        />
                                    </Box>
                                </Flex>
                            </Box>
                        </Flex>
                    ))}
                </Stack>
            )}
            {data?.posts?.hasMore && (
                <Flex>
                    <Button
                        m='auto'
                        my={8}
                        isLoading={isLoadingMorePosts}
                        onClick={loadMorePosts}
                    >
                        {isLoadingMorePosts ? 'Loading' : 'Show More'}
                    </Button>
                </Flex>
            )}
        </Layout>
    );
};

export const getServerSideProps: GetServerSideProps = async (
    context: GetServerSidePropsContext
) => {
    const apolloClient = initializeApollo({ headers: context.req.headers });

    await apolloClient.query({
        query: PostsDocument,
        variables: {
            limit,
        },
    });

    return addApolloState(apolloClient, {
        props: {},
    });
};

export default Index;
