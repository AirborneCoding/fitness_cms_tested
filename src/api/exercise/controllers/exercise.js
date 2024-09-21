'use strict';

/**
 * exercise controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

// module.exports = createCoreController('api::exercise.exercise');

module.exports = createCoreController('api::exercise.exercise', ({ strapi }) => ({
    async findOne(ctx) {
        const { id } = ctx.params;

        // Find the exercise by slug
        const entity = await strapi.db.query("api::exercise.exercise").findOne({
            where: { slug: id },
            populate: ["image", "seo"]
        });

        if (entity) {
            // Find related exercices by muscle group and locale
            const muscleGroupexercises = await strapi.db.query("api::exercise.exercise").findMany({
                where: { muscle: entity.muscle, locale: entity.locale },
                limit: 4,
                populate: ["image"]
            });

            // Filter out the current exercice from the related exercices
            const relatedexercises = muscleGroupexercises
                .filter(exercise => exercise.slug !== id)
                .map(exercise => ({
                    id: exercise.id,
                    name: exercise.name,
                    image: exercise.image.url,
                    slug: exercise.slug,
                }));

            // Attach the related exercices to the entity
            entity.relatedexercises = relatedexercises;

            // Sanitize and transform the response
            const sanitizedEntity = await this.sanitizeOutput(entity, ctx);
            const transformedEntity = this.transformResponse(sanitizedEntity);
            return transformedEntity;
        } else {
            return ctx.notFound(); // Return 404 if the exercise doesn't exist
        }
    },
}));
