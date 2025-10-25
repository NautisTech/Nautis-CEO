

@Post('publish')
async publish(@Body() body: any, @Req() req) {
    const { contentId, platforms } = body;
    const content = await this.cmsService.getContent(contentId);

    for (const platform of platforms) {
        await this.socialService.post(req.user.id, platform, content);
    }

    return { success: true };
}
