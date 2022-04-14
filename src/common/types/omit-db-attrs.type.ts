export type OmitDbAttrs<T> = Omit<T, 'id' | 'createdAt' | 'updatedAt'>
