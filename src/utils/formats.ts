export function formatEmail (email:string){
    const removerEspaço = email.trim();
    const deixarMinusculo = removerEspaço.toLocaleLowerCase();

    return deixarMinusculo.toString();
}