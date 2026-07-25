/* =========================================================
   Craft Recipe Database
   Shared Data Layer
   data.js
   Sort Order Supported
========================================================= */


/* =========================================================
   保存キー
========================================================= */

const CRAFT_STORAGE_KEY =
    "craftRecipeDatabase";


/* =========================================================
   初期データ
========================================================= */

const defaultCraftRecipes = [

    /* =========================
       武器クラフト
    ========================= */

    {
        id: "weapon-001",
        category: "weapon",
        name: "ハンドガン",

        sortOrder: 1,

        description:
            "基本的なハンドガンをクラフトできます。",

        image:
            "images/recipes/handgun.jpg",

        materials: [
            {
                name: "鉄",
                amount: 10
            },
            {
                name: "アルミ",
                amount: 5
            },
            {
                name: "プラスチック",
                amount: 3
            }
        ],

        locations: [
            {
                name: "武器クラフト工場 A",
                address: "番地 1001",

                fieldImage:
                    "images/locations/weapon-a-field.jpg",

                mapImage:
                    "images/locations/weapon-a-map.jpg",

                description:
                    "工場建物の奥にクラフト台があります。"
            },

            {
                name: "武器クラフト工場 B",
                address: "番地 2045",

                fieldImage:
                    "images/locations/weapon-b-field.jpg",

                mapImage:
                    "images/locations/weapon-b-map.jpg",

                description:
                    "倉庫内の右奥にクラフト台があります。"
            }
        ],

        notes:
            "武器クラフトを行う際は必要素材を確認してください。"
    },


    {
        id: "weapon-002",
        category: "weapon",
        name: "ショットガン",

        sortOrder: 2,

        description:
            "近距離向けのショットガンをクラフトできます。",

        image:
            "images/recipes/shotgun.jpg",

        materials: [
            {
                name: "鉄",
                amount: 18
            },
            {
                name: "アルミ",
                amount: 8
            },
            {
                name: "ゴム",
                amount: 4
            }
        ],

        locations: [
            {
                name: "武器クラフト工場 A",
                address: "番地 1001",

                fieldImage:
                    "images/locations/weapon-a-field.jpg",

                mapImage:
                    "images/locations/weapon-a-map.jpg",

                description:
                    "工場建物の奥にクラフト台があります。"
            }
        ],

        notes:
            "作成数を変更すると必要素材数が自動計算されます。"
    },


    /* =========================
       手芸クラフト
    ========================= */

    {
        id: "handicraft-001",
        category: "handicraft",
        name: "バッグ",

        sortOrder: 1,

        description:
            "収納用バッグをクラフトできます。",

        image:
            "images/recipes/bag.jpg",

        materials: [
            {
                name: "布",
                amount: 10
            },
            {
                name: "糸",
                amount: 5
            },
            {
                name: "革",
                amount: 3
            }
        ],

        locations: [
            {
                name: "手芸工房 A",
                address: "番地 3022",

                fieldImage:
                    "images/locations/handicraft-a-field.jpg",

                mapImage:
                    "images/locations/handicraft-a-map.jpg",

                description:
                    "建物1階に手芸クラフト台があります。"
            }
        ],

        notes: ""
    },


    {
        id: "handicraft-002",
        category: "handicraft",
        name: "衣服",

        sortOrder: 2,

        description:
            "基本的な衣服をクラフトできます。",

        image:
            "images/recipes/clothes.jpg",

        materials: [
            {
                name: "布",
                amount: 15
            },
            {
                name: "糸",
                amount: 8
            }
        ],

        locations: [
            {
                name: "手芸工房 B",
                address: "番地 3178",

                fieldImage:
                    "images/locations/handicraft-b-field.jpg",

                mapImage:
                    "images/locations/handicraft-b-map.jpg",

                description:
                    "店内奥側にクラフト場所があります。"
            }
        ],

        notes: ""
    },


    /* =========================
       特殊クラフト
    ========================= */

    {
        id: "special-001",
        category: "special",
        name: "特殊キット",

        sortOrder: 1,

        description:
            "特殊用途に使用するキットです。",

        image:
            "images/recipes/special-kit.jpg",

        materials: [
            {
                name: "電子部品",
                amount: 6
            },
            {
                name: "プラスチック",
                amount: 8
            },
            {
                name: "銅",
                amount: 4
            }
        ],

        locations: [
            {
                name: "特殊クラフト施設 A",
                address: "番地 4500",

                fieldImage:
                    "images/locations/special-a-field.jpg",

                mapImage:
                    "images/locations/special-a-map.jpg",

                description:
                    "地下施設内にクラフト台があります。"
            },

            {
                name: "特殊クラフト施設 B",
                address: "番地 4682",

                fieldImage:
                    "images/locations/special-b-field.jpg",

                mapImage:
                    "images/locations/special-b-map.jpg",

                description:
                    "建物の裏口から入った場所にあります。"
            }
        ],

        notes:
            "特殊クラフトの素材は入手難易度が高い場合があります。"
    },


    /* =========================
       飲食クラフト
    ========================= */

    {
        id: "food-001",
        category: "food",
        name: "ハンバーガー",

        sortOrder: 1,

        description:
            "基本的なハンバーガーを作成できます。",

        image:
            "images/recipes/hamburger.jpg",

        materials: [
            {
                name: "パン",
                amount: 1
            },
            {
                name: "肉",
                amount: 1
            },
            {
                name: "野菜",
                amount: 2
            }
        ],

        locations: [
            {
                name: "レストラン A",
                address: "番地 5201",

                fieldImage:
                    "images/locations/food-a-field.jpg",

                mapImage:
                    "images/locations/food-a-map.jpg",

                description:
                    "キッチン内の調理台で作成できます。"
            }
        ],

        notes:
            "飲食系クラフトは必要数が多くなることがあるため、作成数計算を利用してください。"
    },


    {
        id: "food-002",
        category: "food",
        name: "ドリンク",

        sortOrder: 2,

        description:
            "飲料を作成できます。",

        image:
            "images/recipes/drink.jpg",

        materials: [
            {
                name: "水",
                amount: 1
            },
            {
                name: "砂糖",
                amount: 2
            }
        ],

        locations: [
            {
                name: "レストラン A",
                address: "番地 5201",

                fieldImage:
                    "images/locations/food-a-field.jpg",

                mapImage:
                    "images/locations/food-a-map.jpg",

                description:
                    "店内キッチンで作成できます。"
            }
        ],

        notes: ""
    }

];


/* =========================================================
   データ複製
========================================================= */

function cloneCraftData(data) {

    if (
        typeof structuredClone === "function"
    ) {

        return structuredClone(data);

    }

    return JSON.parse(
        JSON.stringify(data)
    );

}


/* =========================================================
   数値整形
========================================================= */

function normalizeAmount(value) {

    const number =
        Number(value);


    if (
        !Number.isFinite(number) ||
        number < 0
    ) {

        return 0;

    }


    return number;

}


/* =========================================================
   並び順整形
========================================================= */

function normalizeSortOrder(value) {

    const number =
        Number(value);


    if (
        !Number.isFinite(number) ||
        number < 1
    ) {

        return 9999;

    }


    return Math.floor(number);

}


/* =========================================================
   レシピ整形
========================================================= */

function normalizeCraftRecipe(recipe) {

    return {

        id:
            String(
                recipe?.id ?? ""
            ).trim(),

        category:
            String(
                recipe?.category ??
                "weapon"
            ).trim(),

        name:
            String(
                recipe?.name ?? ""
            ).trim(),

        sortOrder:
            normalizeSortOrder(
                recipe?.sortOrder
            ),

        description:
            String(
                recipe?.description ??
                ""
            ),

        image:
            String(
                recipe?.image ??
                ""
            ).trim(),

        materials:
            Array.isArray(
                recipe?.materials
            )
                ? recipe.materials.map(
                    material => ({

                        name:
                            String(
                                material?.name ??
                                ""
                            ).trim(),

                        amount:
                            normalizeAmount(
                                material?.amount
                            )

                    })
                )
                : [],

        locations:
            Array.isArray(
                recipe?.locations
            )
                ? recipe.locations.map(
                    location => ({

                        name:
                            String(
                                location?.name ??
                                ""
                            ).trim(),

                        address:
                            String(
                                location?.address ??
                                ""
                            ).trim(),

                        fieldImage:
                            String(
                                location?.fieldImage ??
                                ""
                            ).trim(),

                        mapImage:
                            String(
                                location?.mapImage ??
                                ""
                            ).trim(),

                        description:
                            String(
                                location?.description ??
                                ""
                            )

                    })
                )
                : [],

        notes:
            String(
                recipe?.notes ??
                ""
            )

    };

}


/* =========================================================
   全データ整形
========================================================= */

function normalizeCraftRecipes(
    recipes
) {

    if (
        !Array.isArray(recipes)
    ) {

        return [];

    }


    const normalized =
        recipes.map(
            normalizeCraftRecipe
        );


    /*
      古い保存データに sortOrder が無い場合、
      カテゴリーごとの現在順を利用して補完します。
    */

    const categoryCounters = {};


    normalized.forEach(
        recipe => {

            const category =
                recipe.category;


            if (
                !categoryCounters[category]
            ) {

                categoryCounters[category] =
                    1;

            }


            if (
                recipe.sortOrder ===
                9999
            ) {

                recipe.sortOrder =
                    categoryCounters[
                    category
                    ];

            }


            categoryCounters[
                category
            ]++;

        }
    );


    return normalized;

}


/* =========================================================
   データ検証
========================================================= */

function validateCraftRecipes(
    recipes
) {

    if (
        !Array.isArray(recipes)
    ) {

        return {
            success: false,
            message:
                "レシピデータは配列形式である必要があります。"
        };

    }


    const allowedCategories =
        new Set([
            "weapon",
            "handicraft",
            "special",
            "food"
        ]);


    const ids =
        new Set();


    for (
        let index = 0;
        index < recipes.length;
        index++
    ) {

        const recipe =
            recipes[index];


        if (
            !recipe ||
            typeof recipe !== "object" ||
            Array.isArray(recipe)
        ) {

            return {
                success: false,
                message:
                    `${index + 1}件目のレシピ形式が正しくありません。`
            };

        }


        const id =
            String(
                recipe.id ?? ""
            ).trim();


        const name =
            String(
                recipe.name ?? ""
            ).trim();


        const category =
            String(
                recipe.category ?? ""
            ).trim();


        if (
            id === ""
        ) {

            return {
                success: false,
                message:
                    `${index + 1}件目のレシピIDがありません。`
            };

        }


        if (
            ids.has(id)
        ) {

            return {
                success: false,
                message:
                    `レシピID「${id}」が重複しています。`
            };

        }


        ids.add(id);


        if (
            name === ""
        ) {

            return {
                success: false,
                message:
                    `「${id}」のクラフト名がありません。`
            };

        }


        if (
            !allowedCategories.has(
                category
            )
        ) {

            return {
                success: false,
                message:
                    `「${name}」のカテゴリーが正しくありません。`
            };

        }


        if (
            recipe.sortOrder !== undefined
        ) {

            const sortOrder =
                Number(
                    recipe.sortOrder
                );


            if (
                !Number.isFinite(
                    sortOrder
                ) ||
                sortOrder < 1
            ) {

                return {
                    success: false,
                    message:
                        `「${name}」の表示順が正しくありません。`
                };

            }

        }


        if (
            recipe.materials !== undefined &&
            !Array.isArray(
                recipe.materials
            )
        ) {

            return {
                success: false,
                message:
                    `「${name}」の素材データが正しくありません。`
            };

        }


        if (
            recipe.locations !== undefined &&
            !Array.isArray(
                recipe.locations
            )
        ) {

            return {
                success: false,
                message:
                    `「${name}」の場所データが正しくありません。`
            };

        }


        if (
            Array.isArray(
                recipe.materials
            )
        ) {

            for (
                let materialIndex = 0;
                materialIndex <
                recipe.materials.length;
                materialIndex++
            ) {

                const material =
                    recipe.materials[
                    materialIndex
                    ];


                if (
                    !material ||
                    typeof material !==
                    "object"
                ) {

                    return {
                        success: false,
                        message:
                            `「${name}」の素材${materialIndex + 1}が正しくありません。`
                    };

                }


                const materialName =
                    String(
                        material.name ?? ""
                    ).trim();


                if (
                    materialName === ""
                ) {

                    return {
                        success: false,
                        message:
                            `「${name}」の素材${materialIndex + 1}に名前がありません。`
                    };

                }


                const amount =
                    Number(
                        material.amount
                    );


                if (
                    !Number.isFinite(
                        amount
                    ) ||
                    amount < 0
                ) {

                    return {
                        success: false,
                        message:
                            `「${name}」の素材「${materialName}」の必要数が正しくありません。`
                    };

                }

            }

        }


        if (
            Array.isArray(
                recipe.locations
            )
        ) {

            for (
                let locationIndex = 0;
                locationIndex <
                recipe.locations.length;
                locationIndex++
            ) {

                const location =
                    recipe.locations[
                    locationIndex
                    ];


                if (
                    !location ||
                    typeof location !==
                    "object"
                ) {

                    return {
                        success: false,
                        message:
                            `「${name}」の場所${locationIndex + 1}が正しくありません。`
                    };

                }


                const locationName =
                    String(
                        location.name ?? ""
                    ).trim();


                if (
                    locationName === ""
                ) {

                    return {
                        success: false,
                        message:
                            `「${name}」の場所${locationIndex + 1}に名称がありません。`
                    };

                }

            }

        }

    }


    return {
        success: true,
        message:
            "データ形式に問題ありません。"
    };

}


/* =========================================================
   カテゴリーごとの表示順を整理
========================================================= */

function normalizeCategorySortOrders(
    recipes
) {

    const grouped = {};


    recipes.forEach(
        recipe => {

            if (
                !grouped[
                recipe.category
                ]
            ) {

                grouped[
                    recipe.category
                ] = [];

            }


            grouped[
                recipe.category
            ].push(
                recipe
            );

        }
    );


    Object.values(
        grouped
    ).forEach(
        categoryRecipes => {

            categoryRecipes.sort(
                (a, b) =>
                    (
                        Number(
                            a.sortOrder
                        ) || 9999
                    ) -
                    (
                        Number(
                            b.sortOrder
                        ) || 9999
                    )
            );


            categoryRecipes.forEach(
                (recipe, index) => {

                    recipe.sortOrder =
                        index + 1;

                }
            );

        }
    );


    return recipes;

}


/* =========================================================
   保存
========================================================= */

function saveCraftRecipes(
    recipes
) {

    const validation =
        validateCraftRecipes(
            recipes
        );


    if (
        !validation.success
    ) {

        console.error(
            validation.message
        );

        return false;

    }


    let normalized =
        normalizeCraftRecipes(
            recipes
        );


    normalized =
        normalizeCategorySortOrders(
            normalized
        );


    try {

        localStorage.setItem(
            CRAFT_STORAGE_KEY,
            JSON.stringify(
                normalized
            )
        );


        window.dispatchEvent(
            new CustomEvent(
                "craftDataUpdated",
                {
                    detail: {
                        recipes:
                            cloneCraftData(
                                normalized
                            )
                    }
                }
            )
        );


        return true;

    } catch (error) {

        console.error(
            "クラフトデータの保存に失敗しました。",
            error
        );


        return false;

    }

}


/* =========================================================
   読み込み
========================================================= */

function loadCraftRecipes() {

    try {

        const storedData =
            localStorage.getItem(
                CRAFT_STORAGE_KEY
            );


        if (
            storedData
        ) {

            const parsed =
                JSON.parse(
                    storedData
                );


            /*
              古い保存データでは sortOrder が
              存在しない場合があるため、
              先に整形してから検証します。
            */

            const normalized =
                normalizeCraftRecipes(
                    parsed
                );


            const validation =
                validateCraftRecipes(
                    normalized
                );


            if (
                validation.success
            ) {

                return normalizeCategorySortOrders(
                    normalized
                );

            }


            console.warn(
                "保存データに問題があるため初期データを使用します。",
                validation.message
            );

        }

    } catch (error) {

        console.error(
            "クラフトデータの読み込みに失敗しました。",
            error
        );

    }


    let initialData =
        cloneCraftData(
            defaultCraftRecipes
        );


    initialData =
        normalizeCategorySortOrders(
            initialData
        );


    saveCraftRecipes(
        initialData
    );


    return initialData;

}


/* =========================================================
   初期化
========================================================= */

function resetCraftRecipes() {

    let initialData =
        cloneCraftData(
            defaultCraftRecipes
        );


    initialData =
        normalizeCategorySortOrders(
            initialData
        );


    const success =
        saveCraftRecipes(
            initialData
        );


    if (
        !success
    ) {

        return null;

    }


    return initialData;

}


/* =========================================================
   保存データ削除
========================================================= */

function clearCraftRecipes() {

    try {

        localStorage.removeItem(
            CRAFT_STORAGE_KEY
        );


        window.dispatchEvent(
            new CustomEvent(
                "craftDataUpdated"
            )
        );


        return true;

    } catch (error) {

        console.error(
            "クラフトデータの削除に失敗しました。",
            error
        );


        return false;

    }

}


/* =========================================================
   ID検索
========================================================= */

function findCraftRecipeById(
    recipeId
) {

    const id =
        String(
            recipeId ?? ""
        ).trim();


    if (
        id === ""
    ) {

        return null;

    }


    const recipes =
        loadCraftRecipes();


    return (
        recipes.find(
            recipe =>
                recipe.id === id
        ) ||
        null
    );

}


/* =========================================================
   カテゴリー取得
========================================================= */

function getCraftRecipesByCategory(
    category
) {

    const recipes =
        loadCraftRecipes();


    const filtered =
        !category ||
            category === "all"
            ? recipes
            : recipes.filter(
                recipe =>
                    recipe.category ===
                    category
            );


    return [...filtered].sort(
        (a, b) => {

            const categoryCompare =
                String(
                    a.category
                ).localeCompare(
                    String(
                        b.category
                    )
                );


            if (
                categoryCompare !== 0 &&
                (
                    !category ||
                    category === "all"
                )
            ) {

                return categoryCompare;

            }


            return (
                Number(
                    a.sortOrder
                ) || 9999
            ) -
                (
                    Number(
                        b.sortOrder
                    ) || 9999
                );

        }
    );

}


/* =========================================================
   JSON書き出し
========================================================= */

function exportCraftRecipesJSON() {

    const recipes =
        loadCraftRecipes();


    return JSON.stringify(
        recipes,
        null,
        2
    );

}


/* =========================================================
   JSON読み込み
========================================================= */

function importCraftRecipesJSON(
    jsonText
) {

    if (
        typeof jsonText !==
        "string"
    ) {

        return {
            success: false,
            message:
                "JSONデータが正しくありません。"
        };

    }


    try {

        const parsed =
            JSON.parse(
                jsonText
            );


        const normalized =
            normalizeCraftRecipes(
                parsed
            );


        const validation =
            validateCraftRecipes(
                normalized
            );


        if (
            !validation.success
        ) {

            return validation;

        }


        const ordered =
            normalizeCategorySortOrders(
                normalized
            );


        const success =
            saveCraftRecipes(
                ordered
            );


        if (
            !success
        ) {

            return {
                success: false,
                message:
                    "データの保存に失敗しました。"
            };

        }


        return {
            success: true,
            message:
                "クラフトデータを読み込みました。",
            recipes:
                ordered
        };

    } catch (error) {

        return {
            success: false,
            message:
                "JSONの形式が正しくありません。"
        };

    }

}


/* =========================================================
   他タブ更新
========================================================= */

window.addEventListener(
    "storage",
    event => {

        if (
            event.key !==
            CRAFT_STORAGE_KEY
        ) {

            return;

        }


        window.dispatchEvent(
            new CustomEvent(
                "craftDataUpdated"
            )
        );

    }
);
