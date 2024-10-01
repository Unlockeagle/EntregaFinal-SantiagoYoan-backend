import { Command } from "commander";

const program = new Command()

    

program
    .name("E-commerce")
    .description("E-comercer-para-Coder-Backend")
    .version('2.8.0')
    .option("-p <port>", "Puerto de trabajo", 8080)
    .option("--mode <mode>", "Modo de trabajo", "development");
program.parse();

export default program;

console.log(program.name(), program.version(), "Opciones: " , program.opts())