import { FieldError } from '../generated/graphql';

export const mapFieldErrors = (
    errors: FieldError[]
): { [key: string]: any } => {
    return errors.reduce(
        (accumulatedErrorsObj, error) => ({
            ...accumulatedErrorsObj,
            [error.field]: error.message,
        }),
        {}
    );
};
