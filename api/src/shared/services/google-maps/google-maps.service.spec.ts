import { InternalServerErrorException } from '@nestjs/common';
import { GoogleMapsService } from './google-maps.service';

describe('GoogleMapsService', () => {
    let service: GoogleMapsService;
    let configService: any;
    let fetchMock: jest.Mock;

    beforeEach(() => {
        configService = { get: jest.fn().mockReturnValue('test-api-key') };
        service = new GoogleMapsService(configService);
        fetchMock = jest.fn();
        (global as any).fetch = fetchMock;
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('reads GOOGLE_MAPS_API_KEY from ConfigService on construction', () => {
        expect(configService.get).toHaveBeenCalledWith('GOOGLE_MAPS_API_KEY');
    });

    it('requests the Google Maps timezone API with lat/lng/timestamp/key and maps the response', async () => {
        fetchMock.mockResolvedValue({
            json: jest.fn().mockResolvedValue({
                timeZoneId: 'Europe/Athens',
                timeZoneName: 'Eastern European Summer Time',
                rawOffset: 7200,
                dstOffset: 3600,
            }),
        });

        const result = await service.getTimezone(37.98, 23.72);

        expect(result).toEqual({
            timeZoneId: 'Europe/Athens',
            timeZoneName: 'Eastern European Summer Time',
            rawOffset: 7200,
            dstOffset: 3600,
        });

        const calledUrl: string = fetchMock.mock.calls[0][0];
        expect(calledUrl).toContain('https://maps.googleapis.com/maps/api/timezone/json?');
        expect(calledUrl).toContain('location=37.98,23.72');
        expect(calledUrl).toContain('key=test-api-key');
        expect(calledUrl).toMatch(/timestamp=\d+/);
    });

    it('wraps a fetch failure as InternalServerErrorException', async () => {
        fetchMock.mockRejectedValue(new Error('network down'));

        await expect(service.getTimezone(1, 1)).rejects.toThrow(InternalServerErrorException);
    });

    it('wraps a response-parsing failure as InternalServerErrorException', async () => {
        fetchMock.mockResolvedValue({ json: jest.fn().mockRejectedValue(new Error('bad json')) });

        await expect(service.getTimezone(1, 1)).rejects.toThrow(InternalServerErrorException);
    });
});
