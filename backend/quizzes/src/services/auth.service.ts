import jwt, { Secret } from "jsonwebtoken";
import { AuthenticationError, ApolloError } from "apollo-server";
import { getRepository } from "typeorm";
import User from "../entities/user";
import logger from "../logger";

interface Payload {
  userId: number | string;
}

if (!process.env.JWT_SECRET_KEY) {
  throw new Error("env JWT_SECRET_KEY not found");
}

const secret: Secret = process.env.JWT_SECRET_KEY;

const AuthService = {
  authenticate: async (jwtToken: string): Promise<User | undefined> => {
    if (typeof jwtToken != "string" || !jwtToken.trim()) {
      throw new AuthenticationError("Invalid credentials");
    }

    if (jwtToken.startsWith("Bearer")) {
      jwtToken = jwtToken.slice(7);
    }

    return new Promise((resolve, reject) => {
      jwt.verify(jwtToken, secret, async (err, decoded) => {
        if (err) {
          logger.error(err);
          reject(new ApolloError(err.message, err.name));
          return;
        }

        if (!decoded) {
          reject(new AuthenticationError("Invalid credentials2"));
          return;
        }

        const repository = getRepository(User);
        const user = await repository.findOne((decoded as Payload).userId);

        if (user) {
          resolve(user);
          return;
        }
      });
    });
  },
};

export default AuthService;
