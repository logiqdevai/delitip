import { Body, Controller, Get, Param, Patch, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '@/shared/guards/jwt.guard';
import { RolesGuard } from '@/shared/guards/roles.guard';
import { Roles } from '@/shared/decorators/roles.decorator';
import { CurrentUser } from '@/shared/decorators/current-user.decorator';
import { UsersService } from './services/users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersQuerySchema, UsersQueryType } from './dto/users-query.schema';
import { ZodValidationPipe } from '@/shared/pipes/zod.validation.pipe';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get('me')
    @ApiOperation({ summary: "Get the current user's profile" })
    me(@CurrentUser('id') userId: string) {
        return this.usersService.getById(userId);
    }

    @Patch('me')
    @ApiOperation({ summary: "Update the current user's profile" })
    updateMe(@CurrentUser('id') userId: string, @Body() dto: UpdateUserDto) {
        return this.usersService.updateProfile(userId, dto);
    }

    @Get('me/accounts')
    @ApiOperation({ summary: 'List every Account (Organization, Employee, Customer) tied to the current identity (§11)' })
    myAccounts(@CurrentUser('id') userId: string) {
        return this.usersService.getMyAccounts(userId);
    }

    @Get()
    @UseGuards(RolesGuard)
    @Roles('ADMIN', 'SUPER_ADMIN', 'SUPPORT')
    @ApiOperation({ summary: 'List users (platform staff only)' })
    @ApiQuery({ name: 'page', required: false })
    @ApiQuery({ name: 'limit', required: false })
    @ApiQuery({ name: 'search', required: false })
    findAll(@Query(new ZodValidationPipe(UsersQuerySchema)) query: UsersQueryType) {
        return this.usersService.findAll(query);
    }

    @Get(':id')
    @UseGuards(RolesGuard)
    @Roles('ADMIN', 'SUPER_ADMIN', 'SUPPORT')
    @ApiOperation({ summary: 'Get a user by id (platform staff only)' })
    findOne(@Param('id') id: string) {
        return this.usersService.getById(id);
    }
}
