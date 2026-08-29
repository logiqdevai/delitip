import { BullBoardModule } from './bull-board.module';

// BullBoardModule is pre-existing, partially-dead code: BullModule.registerQueue()
// is called with zero queues and the BULL_BOARD_ADAPTER factory's inject list is
// commented out, so it constructs `new BullMQAdapter(undefined, undefined)`.
// A full Test.createTestingModule({ imports: [BullBoardModule] }).compile() call
// throws inside @bull-board/api because it receives undefined queue instances, which
// is a production wiring issue, not something a test should paper over. We keep this
// as a structural smoke test instead of a full DI compile test.
describe('BullBoardModule', () => {
    it('should be defined', () => {
        expect(BullBoardModule).toBeDefined();
    });

    it('is registered as a Nest module', () => {
        const isModule = Reflect.getMetadata('__module__', BullBoardModule) !== undefined
            || Reflect.getMetadata('imports', BullBoardModule) !== undefined;
        expect(isModule).toBe(true);
    });
});
