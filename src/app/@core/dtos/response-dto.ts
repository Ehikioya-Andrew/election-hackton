export class ResponseDto<T> {
    status!: boolean;
    data?: T;
    message?: string;
}
