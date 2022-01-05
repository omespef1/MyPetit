export class ActionResult<T> {
    isSuccessfull: boolean;
    isError: boolean;
    errorMessage: string;
    messages: string;
    token: string;
    result: T;
}