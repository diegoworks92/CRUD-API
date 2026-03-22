import { validate as validateUuid } from 'uuid';

export const isValidUuid = (id: string): boolean => {
    return validateUuid(id);
};
