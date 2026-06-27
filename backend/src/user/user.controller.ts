import { Controller, Get, Param } from '@nestjs/common';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('search/:username')
  searchUsers(
    @CurrentUser() user: { sub: number },
    @Param('username') username: string,
  ) {
    return this.userService.searchUsers(user.sub, username);
  }

  @Get()
  getUser(@CurrentUser() user: { sub: number }) {
    return this.userService.getLoggedInUserInformation(user.sub);
  }
}
