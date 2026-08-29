import { GoogleMapsService } from './google-maps.service';

describe('GoogleMapsService (module wrapper)', () => {
    it('delegates getTimezone to the shared GoogleMapsService and returns its result verbatim', async () => {
        const sharedService: any = { getTimezone: jest.fn().mockResolvedValue({ timeZoneId: 'Europe/Athens' }) };
        const service = new GoogleMapsService(sharedService);

        const result = await service.getTimezone(37.98, 23.72);

        expect(sharedService.getTimezone).toHaveBeenCalledWith(37.98, 23.72);
        expect(result).toEqual({ timeZoneId: 'Europe/Athens' });
    });

    it('propagates a rejection from the shared GoogleMapsService', async () => {
        const error = new Error('boom');
        const sharedService: any = { getTimezone: jest.fn().mockRejectedValue(error) };
        const service = new GoogleMapsService(sharedService);

        await expect(service.getTimezone(1, 1)).rejects.toThrow(error);
    });
});
