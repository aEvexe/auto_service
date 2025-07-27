import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ConfigService } from "@nestjs/config";
import * as cookieParser from "cookie-parser";

async function strap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  app.use(cookieParser());
  app.setGlobalPrefix("api");
  const PORT = config.get<number>("PORT");
  await app.listen(process.env.PORT ?? 3000, () => {
    console.log(`Server is running at: http://localhost:${PORT}`);
  });
}
strap();
