package com.tigo;

import io.github.cdimascio.dotenv.Dotenv;
import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.security.Security;

@SpringBootApplication
public class TigoBackendApplication {

	public static void main(String[] args) {
		Security.addProvider(new BouncyCastleProvider());
		try {
			Dotenv dotenv = Dotenv.configure().ignoreIfMissing().load();
			dotenv.entries().forEach(entry -> {
				// Only set as system property if not already in OS environment
				if (System.getenv(entry.getKey()) == null) {
					System.setProperty(entry.getKey(), entry.getValue());
				}
			});
		} catch (Exception ignored) {
			// .env absent or unreadable — fine in CI/production
		}
		SpringApplication.run(TigoBackendApplication.class, args);
	}

}
