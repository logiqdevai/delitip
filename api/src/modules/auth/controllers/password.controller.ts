import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PasswordService } from '../services/password.service';
import { ForgotPasswordDto } from '../dto/forgot-password.dto';
import { ResetPasswordDto } from '../dto/reset-password.dto';
import { ChangePasswordDto } from '../dto/change-password.dto';
import { JwtGuard } from '@/shared/guards/jwt.guard';
import { CurrentUser } from '@/shared/decorators/current-user.decorator';

@ApiTags('Password Reset')
@Controller('auth')
export class PasswordController {
    constructor(private readonly passwordService: PasswordService) { }

    @Post('forgot-password')
    @ApiOperation({ summary: 'Request a password reset email' })
    @ApiBody({ type: ForgotPasswordDto })
    @ApiResponse({
        status: 200,
        description: 'Password reset email sent if account exists',
    })
    forgotPassword(@Body() dto: ForgotPasswordDto) {
        return this.passwordService.forgotPassword(dto);
    }

    @Post('reset-password')
    @ApiOperation({ summary: 'Reset password with token from email' })
    @ApiBody({ type: ResetPasswordDto })
    @ApiResponse({
        status: 200,
        description: 'Password reset successfully',
    })
    @ApiResponse({
        status: 400,
        description: 'Invalid or expired reset token',
    })
    resetPassword(@Body() dto: ResetPasswordDto) {
        return this.passwordService.resetPassword(dto);
    }

    @Post('change-password')
    @UseGuards(JwtGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: "Change the current user's password" })
    @ApiBody({ type: ChangePasswordDto })
    @ApiResponse({
        status: 200,
        description: 'Password changed successfully',
    })
    @ApiResponse({
        status: 400,
        description: 'Current password is incorrect',
    })
    changePassword(@CurrentUser('id') userId: string, @Body() dto: ChangePasswordDto) {
        return this.passwordService.changePassword(userId, dto);
    }
}
