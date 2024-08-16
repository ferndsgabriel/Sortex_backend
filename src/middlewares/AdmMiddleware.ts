import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

interface Payload {
    sub: string;
}

export default async function AdmMiddleware(req: Request, res: Response, next: NextFunction) {
    const tokenDeAuth = req.headers.authorization; // verifico se existe um token no header da aplicação

    if (!tokenDeAuth) {
        return res.status(401).send('Rota não autorizada').end();
    } // se n existe a rota n pode ser acessada

    const [prefix, token] = tokenDeAuth.split(' '); // como o token vem com o prefiro e o token separados por espaços, do um split

    try {
        const { sub } = verify(token, process.env.UJWT_ADM as string) as Payload; // tento pegar o sub dentro do token

        if (!sub) {
            return res.status(401).send('Rota não autorizada').end();
        } // se n tiver sub n deixo seguir

        req.adm_id = sub; // se tiver crio o uma tipagem do express que passando o id que mandei no sub

        return next(); // deixo seguir
    } catch (err) {
        return res.status(401).send('Rota não autorizada').end(); // caso de erro eu n deixo seguir
    }
}
