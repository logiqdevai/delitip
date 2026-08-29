import { GoogleMapsController } from './google-maps.controller';

describe('GoogleMapsController', () => {
    it('delegates GET /google-maps/timezone to the service with the given lat/lng', () => {
        const service: any = { getTimezone: jest.fn().mockReturnValue({ timeZoneId: 'Europe/Athens' }) };
        const controller = new GoogleMapsController(service);

        const result = controller.getTimezone(37.98 as any, 23.72 as any);

        expect(service.getTimezone).toHaveBeenCalledWith(37.98, 23.72);
        expect(result).toEqual({ timeZoneId: 'Europe/Athens' });
    });
});
