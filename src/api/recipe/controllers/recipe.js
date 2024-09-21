'use strict';

/**
 * recipe controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

// module.exports = createCoreController('api::recipe.recipe');

module.exports = createCoreController('api::recipe.recipe', ({ strapi }) => ({
    async findOne(ctx) {
        const { id } = ctx.params;

        // Find the recipe by slug
        const entity = await strapi.db.query("api::recipe.recipe").findOne({
            where: { slug: id },
            populate: ["image", "seo"]
        });

        if (entity) {
            // Find related recipes by category and locale
            const categoryRecipes = await strapi.db.query("api::recipe.recipe").findMany({
                where: {
                    recipe_type: entity.recipe_type,
                    ingredients: entity.ingredients,
                    diet_type: entity.diet_type,
                    plat_type: entity.plat_type,
                    clunary_type: entity.clunary_type,
                    locale: entity.locale
                },
                limit: 4,
                populate: ["image"]
            });

            // Filter out the current recipe from the related recipes
            const relatedRecipes = categoryRecipes
                .filter(recipe => recipe.slug !== id)
                .map(recipe => ({
                    id: recipe.id,
                    title: recipe.title,
                    image: recipe.image.url,
                    slug: recipe.slug,
                }));

            // Attach the related recipes to the entity
            entity.relatedRecipes = relatedRecipes;

            // Sanitize and transform the response
            const sanitizedEntity = await this.sanitizeOutput(entity, ctx);
            const transformedEntity = this.transformResponse(sanitizedEntity);
            return transformedEntity;
        } else {
            return ctx.notFound(); // Return 404 if the recipe doesn't exist
        }
    },
}));