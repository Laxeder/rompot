export declare class User {
    id: string;
    name?: string;
    constructor(id: string, name?: string);
    /**
     * * Define o ID do usuário
     * @param id
     */
    setId(id: string): void;
    /**
     * * Define o nome do usuário
     * @param name
     */
    setName(name: string): void;
    /**
     * * Retorna o ID do usuário
     * @returns
     */
    getId(): string;
    /**
     * * Retorna o nome do usuário
     * @returns
     */
    getName(): string | undefined;
    /**
     * * verifica se o usuário tem permissão
     * @param userPermissions
     * @param commandPermissions
     * @param ignore
     * @returns
     */
    checkPermissions(userPermissions: string[], commandPermissions: string[], ignore?: string[]): boolean;
}