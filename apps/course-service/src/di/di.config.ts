import { Container } from 'inversify';
import 'reflect-metadata';

const myContainer = new Container({ autoBindInjectable: true });

export { myContainer };
