'use strict';

/**
 * article controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

// module.exports = createCoreController('api::article.article');

module.exports = createCoreController('api::article.article', ({ strapi }) => ({
    async findOne(ctx) {
        const { id } = ctx.params;

        // Find the article by slug
        const entity = await strapi.db.query("api::article.article").findOne({
            where: { slug: id },
            // populate: ["image"]
            populate: ["image", "seo"]
        });

        if (entity) {
            // Find related articles by category and locale
            const categoryArticles = await strapi.db.query("api::article.article").findMany({
                where: { cate_name: entity.cate_name, locale: entity.locale },
                limit: 4,
                populate: ["image"]
            });

            // Filter out the current article from the related articles
            const relatedArticles = categoryArticles
                .filter(article => article.slug !== id)
                .map(article => ({
                    id: article.id,
                    title: article.title,
                    image: article.image.url,
                    subcate_name: article.subcate_name,
                    slug: article.slug,
                }));

            // Attach the related articles to the entity
            entity.relatedArticles = relatedArticles;

            // Sanitize and transform the response
            const sanitizedEntity = await this.sanitizeOutput(entity, ctx);
            const transformedEntity = this.transformResponse(sanitizedEntity);
            return transformedEntity;
        } else {
            return ctx.notFound(); // Return 404 if the article doesn't exist
        }
    },
}));
