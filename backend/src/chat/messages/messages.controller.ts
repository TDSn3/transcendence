import { Controller, Get } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { MessagesService } from "./messages.service";

@Controller("api/messages")
@ApiTags("messages")
export class MessagesController {
	constructor(private messagesService: MessagesService) {}

	// @Get(":")
	// async getAllMessages(): Promise<any> {
	// 	return (this.messagesService.getAllMessages);
	// }
}
