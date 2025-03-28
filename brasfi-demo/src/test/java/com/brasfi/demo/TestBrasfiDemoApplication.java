package com.brasfi.demo;

import org.springframework.boot.SpringApplication;

public class TestBrasfiDemoApplication {

	public static void main(String[] args) {
		SpringApplication.from(BrasfiDemoApplication::main).with(TestcontainersConfiguration.class).run(args);
	}

}
