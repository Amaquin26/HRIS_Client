export class ProblemDetails {
    status: number;
    title: string;
    detail: string;

    constructor(problemDetail: ProblemDetails) {
        this.status = problemDetail.status;
        this.title = problemDetail.title;
        this.detail = problemDetail.detail;
    }
}