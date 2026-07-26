/* =========================================================
   Craft Recipe Database
   Supabase Common Layer
   supabase.js
========================================================= */


/* =========================================================
   Supabase設定

   ★ここだけ自分の情報に変更してください
========================================================= */

const SUPABASE_URL =
    "https://qnxlxmxfkdzgsmisdgbg.supabase.co";


const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_cY_BradgtCkVcfotD8-KJQ_916EqnD8";


/* =========================================================
   Storage設定
========================================================= */

const CRAFT_IMAGE_BUCKET =
    "craft-images";


/* =========================================================
   Supabaseクライアント
========================================================= */

const craftSupabase =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_PUBLISHABLE_KEY,
        {
            auth: {
                persistSession: true,
                autoRefreshToken: true,
                detectSessionInUrl: true
            }
        }
    );


/* =========================================================
   カテゴリー
========================================================= */

const CRAFT_CATEGORIES = [
    "weapon",
    "handicraft",
    "special",
    "food"
];


/* =========================================================
   エラー表示
========================================================= */

function logSupabaseError(
    label,
    error
) {

    console.error(
        `[Supabase] ${label} `,
        error
    );

}


/* =========================================================
   レシピ一覧取得
========================================================= */

async function loadCraftRecipes() {

    try {

        /* =========================
           レシピ本体
        ========================= */

        const {
            data: recipeRows,
            error: recipeError
        } =
            await craftSupabase
                .from("recipes")
                .select("*")
                .order(
                    "category",
                    {
                        ascending: true
                    }
                )
                .order(
                    "sort_order",
                    {
                        ascending: true
                    }
                );


        if (recipeError) {

            throw recipeError;

        }


        /* =========================
           素材
        ========================= */

        const {
            data: materialRows,
            error: materialError
        } =
            await craftSupabase
                .from("materials")
                .select("*")
                .order(
                    "sort_order",
                    {
                        ascending: true
                    }
                );


        if (materialError) {

            throw materialError;

        }


        /* =========================
           場所
        ========================= */

        const {
            data: locationRows,
            error: locationError
        } =
            await craftSupabase
                .from("locations")
                .select("*")
                .order(
                    "sort_order",
                    {
                        ascending: true
                    }
                );


        if (locationError) {

            throw locationError;

        }


        /* =========================
           JavaScript用データへ変換
        ========================= */

        const recipes =
            (recipeRows || []).map(
                recipe => {

                    const materials =
                        (materialRows || [])
                            .filter(
                                material =>
                                    material.recipe_id ===
                                    recipe.id
                            )
                            .map(
                                material => ({
                                    name:
                                        material.name,

                                    amount:
                                        Number(
                                            material.amount
                                        ) || 0
                                })
                            );


                    const locations =
                        (locationRows || [])
                            .filter(
                                location =>
                                    location.recipe_id ===
                                    recipe.id
                            )
                            .map(
                                location => ({
                                    name:
                                        location.name || "",

                                    address:
                                        location.address || "",

                                    fieldImage:
                                        location.field_image || "",

                                    mapImage:
                                        location.map_image || "",

                                    description:
                                        location.description || ""
                                })
                            );


                    return {

                        id:
                            recipe.id,

                        category:
                            recipe.category,

                        name:
                            recipe.name,

                        sortOrder:
                            Number(
                                recipe.sort_order
                            ) || 1,

                        description:
                            recipe.description || "",

                        image:
                            recipe.image || "",

                        materials,

                        locations,

                        notes:
                            recipe.notes || ""

                    };

                }
            );


        return recipes;

    } catch (error) {

        logSupabaseError(
            "レシピ読み込み失敗",
            error
        );


        return [];

    }

}


/* =========================================================
   1件取得
========================================================= */

async function findCraftRecipeById(
    recipeId
) {

    const recipes =
        await loadCraftRecipes();


    return (
        recipes.find(
            recipe =>
                recipe.id ===
                recipeId
        ) ||
        null
    );

}


/* =========================================================
   管理者ログイン
========================================================= */

async function signInCraftAdmin(
    email,
    password
) {

    const {
        data,
        error
    } =
        await craftSupabase
            .auth
            .signInWithPassword({
                email,
                password
            });


    if (error) {

        return {
            success: false,
            message:
                error.message,
            data: null
        };

    }


    return {
        success: true,
        message:
            "ログインしました。",
        data
    };

}


/* =========================================================
   ログアウト
========================================================= */

async function signOutCraftAdmin() {

    const {
        error
    } =
        await craftSupabase
            .auth
            .signOut();


    if (error) {

        return {
            success: false,
            message:
                error.message
        };

    }


    return {
        success: true,
        message:
            "ログアウトしました。"
    };

}


/* =========================================================
   現在のログインユーザー
========================================================= */

async function getCraftAdminUser() {

    const {
        data,
        error
    } =
        await craftSupabase
            .auth
            .getUser();


    if (error) {

        return null;

    }


    return (
        data?.user ||
        null
    );

}


/* =========================================================
   レシピ保存
========================================================= */

async function saveCraftRecipe(
    recipe
) {

    try {

        /* =========================
           recipes保存
        ========================= */

        const {
            error: recipeError
        } =
            await craftSupabase
                .from("recipes")
                .upsert({
                    id:
                        recipe.id,

                    category:
                        recipe.category,

                    name:
                        recipe.name,

                    sort_order:
                        Number(
                            recipe.sortOrder
                        ) || 1,

                    description:
                        recipe.description || "",

                    image:
                        recipe.image || "",

                    notes:
                        recipe.notes || "",

                    updated_at:
                        new Date()
                            .toISOString()
                });


        if (recipeError) {

            throw recipeError;

        }


        /* =========================
           既存素材削除
        ========================= */

        const {
            error: deleteMaterialsError
        } =
            await craftSupabase
                .from("materials")
                .delete()
                .eq(
                    "recipe_id",
                    recipe.id
                );


        if (
            deleteMaterialsError
        ) {

            throw deleteMaterialsError;

        }


        /* =========================
           素材再登録
        ========================= */

        if (
            Array.isArray(
                recipe.materials
            ) &&
            recipe.materials.length > 0
        ) {

            const materialRows =
                recipe.materials.map(
                    (material, index) => ({
                        recipe_id:
                            recipe.id,

                        name:
                            material.name,

                        amount:
                            Number(
                                material.amount
                            ) || 0,

                        sort_order:
                            index + 1
                    })
                );


            const {
                error: materialError
            } =
                await craftSupabase
                    .from("materials")
                    .insert(
                        materialRows
                    );


            if (
                materialError
            ) {

                throw materialError;

            }

        }


        /* =========================
           既存場所削除
        ========================= */

        const {
            error: deleteLocationsError
        } =
            await craftSupabase
                .from("locations")
                .delete()
                .eq(
                    "recipe_id",
                    recipe.id
                );


        if (
            deleteLocationsError
        ) {

            throw deleteLocationsError;

        }


        /* =========================
           場所再登録
        ========================= */

        if (
            Array.isArray(
                recipe.locations
            ) &&
            recipe.locations.length > 0
        ) {

            const locationRows =
                recipe.locations.map(
                    (location, index) => ({
                        recipe_id:
                            recipe.id,

                        name:
                            location.name,

                        address:
                            location.address || "",

                        field_image:
                            location.fieldImage || "",

                        map_image:
                            location.mapImage || "",

                        description:
                            location.description || "",

                        sort_order:
                            index + 1
                    })
                );


            const {
                error: locationError
            } =
                await craftSupabase
                    .from("locations")
                    .insert(
                        locationRows
                    );


            if (
                locationError
            ) {

                throw locationError;

            }

        }


        return {
            success: true,
            message:
                "レシピを保存しました。"
        };

    } catch (error) {

        logSupabaseError(
            "レシピ保存失敗",
            error
        );


        return {
            success: false,
            message:
                error.message ||
                "レシピの保存に失敗しました。"
        };

    }

}


/* =========================================================
   レシピ削除
========================================================= */

async function deleteCraftRecipe(
    recipeId
) {

    try {

        /*
          materials / locations は
          ON DELETE CASCADEで自動削除
        */

        const {
            error
        } =
            await craftSupabase
                .from("recipes")
                .delete()
                .eq(
                    "id",
                    recipeId
                );


        if (error) {

            throw error;

        }


        return {
            success: true,
            message:
                "レシピを削除しました。"
        };

    } catch (error) {

        logSupabaseError(
            "レシピ削除失敗",
            error
        );


        return {
            success: false,
            message:
                error.message ||
                "削除に失敗しました。"
        };

    }

}


/* =========================================================
   表示順保存
========================================================= */

async function saveCraftSortOrders(
    orderedRecipes
) {

    try {

        for (
            const recipe
            of orderedRecipes
        ) {

            const {
                error
            } =
                await craftSupabase
                    .from("recipes")
                    .update({
                        sort_order:
                            Number(
                                recipe.sortOrder
                            ) || 1,

                        updated_at:
                            new Date()
                                .toISOString()
                    })
                    .eq(
                        "id",
                        recipe.id
                    );


            if (error) {

                throw error;

            }

        }


        return {
            success: true,
            message:
                "表示順を保存しました。"
        };

    } catch (error) {

        logSupabaseError(
            "表示順保存失敗",
            error
        );


        return {
            success: false,
            message:
                error.message ||
                "表示順の保存に失敗しました。"
        };

    }

}


/* =========================================================
   ファイル名安全化
========================================================= */

function sanitizeFileName(fileName) {

    const originalName =
        String(fileName || "image.jpg");


    const lastDot =
        originalName.lastIndexOf(".");


    let extension =
        "jpg";


    let baseName =
        originalName;


    if (
        lastDot > 0 &&
        lastDot <
        originalName.length - 1
    ) {

        extension =
            originalName
                .slice(lastDot + 1)
                .toLowerCase()
                .replace(
                    /[^a-z0-9]/g,
                    ""
                ) || "jpg";


        baseName =
            originalName.slice(
                0,
                lastDot
            );

    }


    baseName =
        baseName
            .normalize("NFKD")
            .replace(
                /[^a-zA-Z0-9_-]/g,
                "-"
            )
            .replace(
                /-+/g,
                "-"
            )
            .replace(
                /^-+|-+$/g,
                "");


    if (!baseName) {

        baseName =
            "image";

    }


    return (
        `${baseName}.${extension}`
    );

}


/* =========================================================
   画像アップロード
========================================================= */

async function uploadCraftImage(
    file,
    folder = "recipes"
) {

    if (!file) {

        return {
            success: false,
            message:
                "画像が選択されていません。"
        };

    }


    if (
        !file.type.startsWith(
            "image/"
        )
    ) {

        return {
            success: false,
            message:
                "画像ファイルを選択してください。"
        };

    }


    try {

        const safeName =
            sanitizeFileName(
                file.name
            );


        const uniqueName =
            `${Date.now()}-${crypto.randomUUID()}-${safeName}`;


        const path =
            `${folder}/${uniqueName}`;


        const {
            error
        } =
            await craftSupabase
                .storage
                .from(
                    CRAFT_IMAGE_BUCKET
                )
                .upload(
                    path,
                    file,
                    {
                        cacheControl:
                            "3600",

                        upsert:
                            false,

                        contentType:
                            file.type
                    }
                );


        if (error) {

            throw error;

        }


        const {
            data
        } =
            craftSupabase
                .storage
                .from("craft-images")
                .getPublicUrl(path);


        return {
            success: true,
            path,
            url:
                data.publicUrl
        };

    } catch (error) {

        logSupabaseError(
            "画像アップロード失敗",
            error
        );


        return {
            success: false,
            message:
                error.message ||
                "画像のアップロードに失敗しました。"
        };

    }

}


/* =========================================================
   画像削除
========================================================= */

async function deleteCraftImage(
    path
) {

    if (!path) {

        return {
            success: true
        };

    }


    try {

        const {
            error
        } =
            await craftSupabase
                .storage
                .from(
                    CRAFT_IMAGE_BUCKET
                )
                .remove([
                    path
                ]);


        if (error) {

            throw error;

        }


        return {
            success: true
        };

    } catch (error) {

        logSupabaseError(
            "画像削除失敗",
            error
        );


        return {
            success: false,
            message:
                error.message ||
                "画像の削除に失敗しました。"
        };

    }

}


/* =========================================================
   Realtime
========================================================= */

function subscribeCraftRecipeChanges(
    callback
) {

    const channel =
        craftSupabase
            .channel(
                "craft-recipe-changes"
            )
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "recipes"
                },
                callback
            )
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "materials"
                },
                callback
            )
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "locations"
                },
                callback
            )
            .subscribe();


    return channel;

}


/* =========================================================
   Realtime解除
========================================================= */

async function unsubscribeCraftRecipeChanges(
    channel
) {

    if (!channel) {

        return;

    }


    await craftSupabase
        .removeChannel(
            channel
        );

}