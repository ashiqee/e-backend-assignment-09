type IOptions = {
    page?: number,
    limit?: number,
    sortOrder?: string,
    sortBy?: string,
    shopId?: string
}

type IOptionsResult = {
    page: number,
    limit: number,
    skip: number,
    sortBy: string,
    sortOrder: string,
    shopId: string,
}

const calculatePagination = (options: IOptions): IOptionsResult => {

    const page: number = Number(options.page) || 1;
    const limit: number = Number(options.limit) || 20;
    const skip: number = (Number(page) - 1) * limit;
    const shopId: string = options.shopId || '';

    const sortBy: string = options.sortBy || 'createdAt';
    const sortOrder: string = options.sortOrder || 'desc';

    return {
        page,
        limit,
        skip,
        sortBy,
        sortOrder,
        shopId,
    }
}


export const paginationHelper = {
    calculatePagination
}