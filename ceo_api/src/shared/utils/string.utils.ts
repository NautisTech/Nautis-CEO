export class StringUtils {
    static generateSlug(text: string): string {
        return text
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '') // Remove acentos
            .replace(/[^\w\s-]/g, '') // Remove caracteres especiais
            .replace(/\s+/g, '-') // Substitui espaços por hífens
            .replace(/--+/g, '-') // Remove hífens duplos
            .trim();
    }

    static truncate(text: string, length: number): string {
        if (text.length <= length) return text;
        return text.substring(0, length) + '...';
    }

    static generateRandomString(length: number = 10): string {
        return Math.random()
            .toString(36)
            .substring(2, length + 2);
    }
}