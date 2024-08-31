// imports
import { routes } from "./routes";
import 'dotenv/config';
import cors from "cors";
import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors';


// iniciando aplicação
const app = express(); 
const port = process.env.Port || 3333; // definindo nossa porta

app.use(cors()); // chamando a função
app.use(express.json()); // JSON middleware antes das rotas
app.use(routes); // pedindo pro app usar as rotas do arquivo exportado


app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof Error) {
        // Retorna o erro como JSON
        return res.status(400).json({
            error: err.message,
        });
    }
    
    // Erros genéricos são tratados aqui
    return res.status(500).json({
        status: 'error',
        message: 'Internal server error.',
    });
});



app.listen(port, ()=>{ // mandando nosso app escutar a porta
    console.log('Servidor ativo'); //se ele estiver ativo e tudo der certo, retorna que o servidor foi ativo 
});

routes.get('/test', async (req: Request, res: Response) => {
    return res.send('Test endpoint working');
});
