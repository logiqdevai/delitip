import { AuthRole } from 'generated/prisma';
import { EmployeePayoutAccountController } from './employee-payout-account.controller';

describe('EmployeePayoutAccountController', () => {
    let controller: EmployeePayoutAccountController;
    let service: any;

    const user = { id: 'u1', role: AuthRole.USER };

    beforeEach(() => {
        service = {
            createForEmployee: jest.fn(),
            findForEmployee: jest.fn(),
            updateForEmployee: jest.fn(),
            refreshStatusForEmployee: jest.fn(),
        };
        controller = new EmployeePayoutAccountController(service);
    });

    it('create() delegates to createForEmployee with the current user, employeeId param, and body', () => {
        const dto = { iban: 'GR1601101250000000012300695', beneficiary_name: 'Ada Lovelace' };
        service.createForEmployee.mockReturnValue('created');

        expect(controller.create(user, 'e1', dto as any)).toBe('created');
        expect(service.createForEmployee).toHaveBeenCalledWith(user, 'e1', dto);
    });

    it('findOne() delegates to findForEmployee', () => {
        service.findForEmployee.mockReturnValue('found');

        expect(controller.findOne(user, 'e1')).toBe('found');
        expect(service.findForEmployee).toHaveBeenCalledWith(user, 'e1');
    });

    it('update() delegates to updateForEmployee with the body', () => {
        const dto = { beneficiary_name: 'New Name' };
        service.updateForEmployee.mockReturnValue('updated');

        expect(controller.update(user, 'e1', dto as any)).toBe('updated');
        expect(service.updateForEmployee).toHaveBeenCalledWith(user, 'e1', dto);
    });

    it('refreshStatus() delegates to refreshStatusForEmployee', () => {
        service.refreshStatusForEmployee.mockReturnValue('refreshed');

        expect(controller.refreshStatus(user, 'e1')).toBe('refreshed');
        expect(service.refreshStatusForEmployee).toHaveBeenCalledWith(user, 'e1');
    });
});
