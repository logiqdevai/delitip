import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '@/shared/guards/jwt.guard';
import { RolesGuard } from '@/shared/guards/roles.guard';
import { Roles } from '@/shared/decorators/roles.decorator';
import { CurrentUser } from '@/shared/decorators/current-user.decorator';
import { AuthUser } from '@/shared/services/access-control/access-control.service';
import { ZodValidationPipe } from '@/shared/pipes/zod.validation.pipe';
import { PaginationQuerySchema, PaginationQueryType } from '@/shared/utils/pagination/pagination-query.schema';
import { EmployeesService } from './services/employees.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { EmployeesQuerySchema, EmployeesQueryType } from './dto/employees-query.schema';

@ApiTags('Employees')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller()
export class EmployeesController {
    constructor(private readonly employeesService: EmployeesService) { }

    @Post('stores/:storeId/employees')
    @ApiOperation({ summary: 'Add an Employee to a Store — links/creates their Account by email (§11)' })
    create(
        @CurrentUser() user: AuthUser,
        @Param('storeId') storeId: string,
        @Body() dto: CreateEmployeeDto,
    ) {
        return this.employeesService.create(user, storeId, dto);
    }

    @Get('stores/:storeId/employees')
    @ApiOperation({ summary: "List a Store's Employees" })
    @ApiQuery({ name: 'page', required: false })
    @ApiQuery({ name: 'limit', required: false })
    @ApiQuery({ name: 'is_active', required: false })
    findAllForStore(
        @CurrentUser() user: AuthUser,
        @Param('storeId') storeId: string,
        @Query(new ZodValidationPipe(EmployeesQuerySchema)) query: EmployeesQueryType,
    ) {
        return this.employeesService.findAllForStore(user, storeId, query);
    }

    @Get('employees/:id')
    @ApiOperation({ summary: 'Get an Employee — accessible by the employee themself or a store role' })
    findOne(@CurrentUser() user: AuthUser, @Param('id') id: string) {
        return this.employeesService.findOne(user, id);
    }

    @Patch('employees/:id')
    @ApiOperation({
        summary: 'Update an Employee (Owner/Store Manager) — an Employee may update only their own photo_document_id',
    })
    update(@CurrentUser() user: AuthUser, @Param('id') id: string, @Body() dto: UpdateEmployeeDto) {
        return this.employeesService.update(user, id, dto);
    }

    @Delete('employees/:id')
    @UseGuards(RolesGuard)
    @Roles('ADMIN', 'SUPER_ADMIN')
    @ApiOperation({ summary: 'Remove an Employee (platform Admin / Super Admin only)' })
    remove(@CurrentUser() user: AuthUser, @Param('id') id: string) {
        return this.employeesService.remove(user, id);
    }

    @Get('employees/:id/dashboard')
    @ApiOperation({ summary: 'Employee Dashboard (§13) — self or a store role' })
    dashboard(@CurrentUser() user: AuthUser, @Param('id') id: string) {
        return this.employeesService.dashboard(user, id);
    }

    @Get('employees/:id/tips')
    @ApiOperation({ summary: "An Employee's Tip Distributions — self or a store role" })
    @ApiQuery({ name: 'page', required: false })
    @ApiQuery({ name: 'limit', required: false })
    tips(
        @CurrentUser() user: AuthUser,
        @Param('id') id: string,
        @Query(new ZodValidationPipe(PaginationQuerySchema)) query: PaginationQueryType,
    ) {
        return this.employeesService.tips(user, id, query);
    }

    @Get('employees/:id/reviews')
    @ApiOperation({ summary: "An Employee's Reviews — self or a store role" })
    @ApiQuery({ name: 'page', required: false })
    @ApiQuery({ name: 'limit', required: false })
    reviews(
        @CurrentUser() user: AuthUser,
        @Param('id') id: string,
        @Query(new ZodValidationPipe(PaginationQuerySchema)) query: PaginationQueryType,
    ) {
        return this.employeesService.reviews(user, id, query);
    }
}
