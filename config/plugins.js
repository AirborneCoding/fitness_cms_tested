module.exports = ({ env }) => ({
    //* CLOUDINARY
    upload: {
        config: {
            provider: 'cloudinary',
            providerOptions: {
                cloud_name: env('CLOUDINARY_NAME'),
                api_key: env('CLOUDINARY_KEY'),
                api_secret: env('CLOUDINARY_SECRET'),
            },
            actionOptions: {
                upload: {},
                uploadStream: {
                    folder: env("CLOUDINARY_FOLDER", ""),
                },
                delete: {},
            },
        },
    },

    //* GRAPHQL
    graphql: {
        config: {
            endpoint: '/v1/graphql',
            shadowCRUD: true,
            playgroundAlways: true,
            depthLimit: 7,
            amountLimit: 100,
        }
    },

    //* SEO
    seo: {
        enabled: true,
    },


    //* fuzzy search
    "fuzzy-search": {
        enabled: true,
        config: {
            contentTypes: [
                // articles
                {
                    uid: "api::article.article",
                    modelName: "articles",
                    transliterate: true,
                    fuzzysortOptions: {
                        characterLimit: 500,
                        threshold: 0.5,
                        // limit: 15,
                        keys: [
                            {
                                name: "title",
                                weight: 100,
                            },
                            {
                                name: "content",
                                weight: 100, // -0.1 100
                            },
                        ],
                    },
                },
                // exercises
                {
                    uid: "api::exercise.exercise",
                    modelName: "exercises",
                    transliterate: true,
                    fuzzysortOptions: {
                        characterLimit: 500,
                        threshold: 0.6,
                        // limit: 15,
                        keys: [
                            {
                                name: "name",
                                weight: 0.1,
                            },
                        ],
                    },
                },
                // programs
                {
                    uid: "api::program.program",
                    modelName: "programs",
                    transliterate: true,
                    fuzzysortOptions: {
                        characterLimit: 500,
                        threshold: 0.6,
                        // limit: 15,
                        keys: [
                            {
                                name: "title",
                                weight: 0.1,
                            },
                            // {
                            //     name: "program_overview",
                            //     weight: -0.1, //100
                            // },
                        ],
                    },
                },
                // recipes
                {
                    uid: "api::recipe.recipe",
                    modelName: "recipes",
                    transliterate: true,
                    fuzzysortOptions: {
                        characterLimit: 500,
                        threshold: 0.6,
                        // limit: 15,
                        keys: [
                            {
                                name: "title",
                                weight: 0.1,
                            },
                            // {
                            //     name: "content",
                            //     weight: -0.1, //100
                            // },
                        ],
                    },
                },
                // calculators
                {
                    uid: "api::calculator.calculator",
                    modelName: "calculators",
                    transliterate: true,
                    fuzzysortOptions: {
                        characterLimit: 500,
                        threshold: 0.6,
                        // limit: 15,
                        keys: [
                            {
                                name: "title",
                                weight: 0.1,
                            },
                            // {
                            //     name: "content",
                            //     weight: 100, //100
                            // },
                        ],
                    },
                },
            ]
        }
    },


    //* CACHE
    // redis: {
    //     enabled: true,
    //     config: {
    //         connections: {
    //             default: {
    //                 connection: {
    //                     host: 'redis-14699.c241.us-east-1-4.ec2.redns.redis-cloud.com',
    //                     port: 14699,
    //                     password: "9yKciV64o1bPwZp6fBAYylrJaZAqa1MR",
    //                     // db: "cache-M09VW2H4"
    //                 },
    //                 settings: {
    //                     debug: true,
    //                 },
    //             },
    //         },
    //     },
    // },
    // // Step 2: Configure the redis cache plugin
    // "rest-cache": {
    //     enabled: true,
    //     config: {
    //         provider: {
    //             name: "redis",
    //             options: {
    //                 max: 32767,
    //                 connection: "default",
    //             },
    //         },
    //         strategy: {

    //             enableEtagSupport: true,
    //             logs: true,
    //             clearRelatedCache: true,
    //             maxAge: 3600000,
    //             contentTypes: [
    //                 // list of Content-Types UID to cache
    //                 "api::article.article",
    //                 "api::exercise.exercise",
    //             ],
    //         },
    //     },
    // },
});
