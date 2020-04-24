import app from './app';

const port = process.env.PORT || 3333;

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`⇪ Aplicação executando na porta..: ${port} ⇪`);
});
