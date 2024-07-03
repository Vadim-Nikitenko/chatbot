export interface IDbService {
    connect: () => void;
    disconnect: () => void;
}