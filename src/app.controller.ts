import { Controller, Get, HttpCode, Req, Res } from '@nestjs/common';
import { ApiFoundResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { Public } from './auth/decorators/public.decorator';

@Public()
@ApiTags('Root')
@Controller()
export class AppController {
  constructor() {
    return;
  }

  @ApiOperation({
    summary:
      "Accesses to this rout will be redirected to the API docs at '/api'.",
  })
  @ApiFoundResponse()
  @HttpCode(302)
  @Get()
  redirectRootToDocs(@Req() req: Request, @Res() res: Response) {
    return res.redirect('/api');
  }
}
