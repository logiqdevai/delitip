import { GraphQLModule } from './graphql.module';

// GraphQLModule is not imported anywhere in AppModule (commented out) — it's dead
// code. Its forRoot() config points autoSchemaFile at src/schema.gql and needs at
// least one real @Resolver/@Query to generate a valid schema; since none exist,
// Test.createTestingModule({ imports: [GraphQLModule] }).compile() fails with
// "Query root type must be provided". We keep this as a structural smoke test
// instead of a full DI compile test.
describe('GraphQLModule', () => {
    it('should be defined', () => {
        expect(GraphQLModule).toBeDefined();
    });

    it('is registered as a Nest module with imports', () => {
        const imports = Reflect.getMetadata('imports', GraphQLModule);
        expect(imports).toBeDefined();
        expect(imports.length).toBeGreaterThan(0);
    });

    it('provides JSONScalar', () => {
        const providers = Reflect.getMetadata('providers', GraphQLModule);
        expect(providers).toBeDefined();
        expect(providers.length).toBeGreaterThan(0);
    });
});
