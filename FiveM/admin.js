/* =========================================================
   Craft Recipe Database
   Admin Panel
   Supabase Version
========================================================= */


/* =========================================================
   設定
========================================================= */

const BACKUP_STORAGE_KEY =
    "craftRecipeSupabaseBackup";


const categoryLabels = {
    weapon: "武器",
    handicraft: "手芸",
    special: "特殊",
    food: "飲食"
};


const categorySortOrder = {
    weapon: 1,
    handicraft: 2,
    special: 3,
    food: 4
};


/* =========================================================
   DOM - ログイン
========================================================= */

const loginScreen =
    document.getElementById("loginScreen");

const loginForm =
    document.getElementById("loginForm");

const loginEmail =
    document.getElementById("loginEmail");

const loginPassword =
    document.getElementById("loginPassword");

const loginButton =
    document.getElementById("loginButton");

const loginError =
    document.getElementById("loginError");

const adminApp =
    document.getElementById("adminApp");

const adminUserEmail =
    document.getElementById("adminUserEmail");

const logoutButton =
    document.getElementById("logoutButton");


/* =========================================================
   DOM - 一覧
========================================================= */

const adminRecipeList =
    document.getElementById("adminRecipeList");

const adminRecipeCount =
    document.getElementById("adminRecipeCount");

const adminSearchInput =
    document.getElementById("adminSearchInput");

const adminCategoryFilter =
    document.getElementById("adminCategoryFilter");

const adminEmptyState =
    document.getElementById("adminEmptyState");


/* =========================================================
   DOM - エディター
========================================================= */

const editorEmptyState =
    document.getElementById("editorEmptyState");

const recipeEditorForm =
    document.getElementById("recipeEditorForm");

const editorTitle =
    document.getElementById("editorTitle");


/* 基本 */

const recipeIdInput =
    document.getElementById("recipeId");

const recipeCategoryInput =
    document.getElementById("recipeCategory");

const recipeNameInput =
    document.getElementById("recipeName");

const recipeDescriptionInput =
    document.getElementById("recipeDescription");

const recipeImageInput =
    document.getElementById("recipeImage");

const recipeImagePath =
    document.getElementById("recipeImagePath");

const recipeImageFile =
    document.getElementById("recipeImageFile");

const recipeImagePreviewWrap =
    document.getElementById("recipeImagePreviewWrap");

const recipeImagePreview =
    document.getElementById("recipeImagePreview");

const removeRecipeImageButton =
    document.getElementById("removeRecipeImageButton");

const recipeNotesInput =
    document.getElementById("recipeNotes");


/* 素材 */

const materialsEditor =
    document.getElementById("materialsEditor");

const materialsEmpty =
    document.getElementById("materialsEmpty");

const materialTemplate =
    document.getElementById("materialTemplate");


/* 場所 */

const locationsEditor =
    document.getElementById("locationsEditor");

const locationsEmpty =
    document.getElementById("locationsEmpty");

const locationTemplate =
    document.getElementById("locationTemplate");


/* 操作 */

const addRecipeButton =
    document.getElementById("addRecipeButton");

const emptyAddRecipeButton =
    document.getElementById("emptyAddRecipeButton");

const addMaterialButton =
    document.getElementById("addMaterialButton");

const addLocationButton =
    document.getElementById("addLocationButton");

const deleteRecipeButton =
    document.getElementById("deleteRecipeButton");

const cancelEditButton =
    document.getElementById("cancelEditButton");

const importButton =
    document.getElementById("importButton");

const exportButton =
    document.getElementById("exportButton");

const backupButton =
    document.getElementById("backupButton");

const resetButton =
    document.getElementById("resetButton");


/* =========================================================
   DOM - モーダル
========================================================= */

const deleteConfirmModal =
    document.getElementById("deleteConfirmModal");

const confirmDeleteButton =
    document.getElementById("confirmDeleteButton");


const exportModal =
    document.getElementById("exportModal");

const exportTextarea =
    document.getElementById("exportTextarea");

const copyExportButton =
    document.getElementById("copyExportButton");

const downloadExportButton =
    document.getElementById("downloadExportButton");


const importModal =
    document.getElementById("importModal");

const importFileInput =
    document.getElementById("importFileInput");

const importTextarea =
    document.getElementById("importTextarea");

const executeImportButton =
    document.getElementById("executeImportButton");


const resetConfirmModal =
    document.getElementById("resetConfirmModal");

const confirmResetButton =
    document.getElementById("confirmResetButton");


const backupModal =
    document.getElementById("backupModal");

const backupDescription =
    document.getElementById("backupDescription");

const restoreBackupButton =
    document.getElementById("restoreBackupButton");


const toast =
    document.getElementById("toast");


/* =========================================================
   状態
========================================================= */

let recipes = [];

let selectedRecipeId = null;

let isCreatingNewRecipe = false;

let toastTimer = null;

let isSaving = false;

let realtimeChannel = null;


/* =========================================================
   共通
========================================================= */

function escapeHTML(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


function cloneData(value) {

    if (
        typeof structuredClone === "function"
    ) {

        return structuredClone(value);

    }


    return JSON.parse(
        JSON.stringify(value)
    );

}


/* =========================================================
   Storage URL → ファイルパス
========================================================= */

function getStoragePathFromPublicUrl(url) {

    if (!url) {

        return "";

    }


    const marker =
        "/storage/v1/object/public/craft-images/";


    const index =
        url.indexOf(marker);


    if (
        index === -1
    ) {

        return "";

    }


    return decodeURIComponent(
        url.substring(
            index + marker.length
        )
    );

}


/* =========================================================
   通知
========================================================= */

function showToast(
    message,
    type = ""
) {

    if (!toast) {

        return;

    }


    if (toastTimer) {

        clearTimeout(
            toastTimer
        );

    }


    toast.textContent =
        message;


    toast.className =
        "toast show";


    if (type) {

        toast.classList.add(
            type
        );

    }


    toastTimer =
        setTimeout(
            () => {

                toast.classList.remove(
                    "show"
                );

            },
            2800
        );

}


/* =========================================================
   ログイン画面
========================================================= */

function showLoginScreen() {

    loginScreen.classList.remove(
        "hidden"
    );


    adminApp.classList.add(
        "hidden"
    );

}


function showAdminScreen(user) {

    loginScreen.classList.add(
        "hidden"
    );


    adminApp.classList.remove(
        "hidden"
    );


    adminUserEmail.textContent =
        user?.email || "";

}


/* =========================================================
   ログイン
========================================================= */

async function handleLogin(event) {

    event.preventDefault();


    loginError.classList.add(
        "hidden"
    );


    loginButton.disabled =
        true;


    loginButton.textContent =
        "ログイン中...";


    try {

        const result =
            await signInCraftAdmin(
                loginEmail.value.trim(),
                loginPassword.value
            );


        if (!result.success) {

            loginError.textContent =
                "メールアドレスまたはパスワードを確認してください。";


            loginError.classList.remove(
                "hidden"
            );


            return;

        }


        const user =
            result.data?.user;


        showAdminScreen(user);


        loginPassword.value =
            "";


        await initializeAdminData();

    } catch (error) {

        console.error(error);


        loginError.textContent =
            "ログインに失敗しました。";


        loginError.classList.remove(
            "hidden"
        );

    } finally {

        loginButton.disabled =
            false;


        loginButton.textContent =
            "ログイン";

    }

}


/* =========================================================
   ログアウト
========================================================= */

async function handleLogout() {

    const result =
        await signOutCraftAdmin();


    if (!result.success) {

        showToast(
            "ログアウトに失敗しました。",
            "error"
        );


        return;

    }


    recipes = [];

    selectedRecipeId =
        null;

    isCreatingNewRecipe =
        false;


    stopRealtimeSubscription();


    showLoginScreen();

}


/* =========================================================
   Supabaseデータ取得
========================================================= */

async function reloadAdminData() {

    try {

        recipes =
            await loadCraftRecipes();


        if (
            !Array.isArray(recipes)
        ) {

            recipes = [];

        }


        return true;

    } catch (error) {

        console.error(
            "データ取得失敗",
            error
        );


        recipes = [];


        showToast(
            "Supabaseからデータを読み込めませんでした。",
            "error"
        );


        return false;

    }

}


/* =========================================================
   並び順
========================================================= */

function getCategoryRecipesOrdered(
    category
) {

    return recipes
        .filter(
            recipe =>
                recipe.category ===
                category
        )
        .sort(
            (a, b) => {

                const aOrder =
                    Number(
                        a.sortOrder
                    ) || 9999;


                const bOrder =
                    Number(
                        b.sortOrder
                    ) || 9999;


                if (
                    aOrder !== bOrder
                ) {

                    return (
                        aOrder -
                        bOrder
                    );

                }


                return String(
                    a.name || ""
                ).localeCompare(
                    String(
                        b.name || ""
                    ),
                    "ja"
                );

            }
        );

}


function getNextSortOrder(
    category
) {

    const list =
        getCategoryRecipesOrdered(
            category
        );


    if (
        list.length === 0
    ) {

        return 1;

    }


    return (
        Math.max(
            ...list.map(
                recipe =>
                    Number(
                        recipe.sortOrder
                    ) || 0
            )
        ) + 1
    );

}


/* =========================================================
   検索
========================================================= */

function getFilteredRecipes() {

    const keyword =
        adminSearchInput.value
            .trim()
            .toLowerCase();


    const category =
        adminCategoryFilter.value;


    return recipes
        .filter(
            recipe => {

                const categoryMatch =
                    category === "all" ||
                    recipe.category ===
                    category;


                const materialsText =
                    (recipe.materials || [])
                        .map(
                            material =>
                                material.name || ""
                        )
                        .join(" ");


                const locationsText =
                    (recipe.locations || [])
                        .map(
                            location => `
                ${location.name || ""}
                ${location.address || ""}
              `
                        )
                        .join(" ");


                const text = `
          ${recipe.id || ""}
          ${recipe.name || ""}
          ${recipe.description || ""}
          ${recipe.notes || ""}
          ${materialsText}
          ${locationsText}
        `.toLowerCase();


                return (
                    categoryMatch &&
                    (
                        keyword === "" ||
                        text.includes(
                            keyword
                        )
                    )
                );

            }
        )
        .sort(
            (a, b) => {

                const categoryA =
                    categorySortOrder[
                    a.category
                    ] || 999;


                const categoryB =
                    categorySortOrder[
                    b.category
                    ] || 999;


                if (
                    categoryA !==
                    categoryB
                ) {

                    return (
                        categoryA -
                        categoryB
                    );

                }


                return (
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

            }
        );

}


/* =========================================================
   一覧描画
========================================================= */

function renderRecipeList() {

    const filtered =
        getFilteredRecipes();


    adminRecipeList.innerHTML =
        "";


    adminRecipeCount.textContent =
        filtered.length;


    if (
        filtered.length === 0
    ) {

        adminRecipeList.classList.add(
            "hidden"
        );


        adminEmptyState.classList.remove(
            "hidden"
        );


        return;

    }


    adminRecipeList.classList.remove(
        "hidden"
    );


    adminEmptyState.classList.add(
        "hidden"
    );


    filtered.forEach(
        recipe => {

            const categoryRecipes =
                getCategoryRecipesOrdered(
                    recipe.category
                );


            const categoryIndex =
                categoryRecipes.findIndex(
                    item =>
                        item.id ===
                        recipe.id
                );


            const row =
                document.createElement(
                    "div"
                );


            row.className =
                "admin-recipe-row";


            if (
                recipe.id ===
                selectedRecipeId
            ) {

                row.classList.add(
                    "active"
                );

            }


            const mainButton =
                document.createElement(
                    "button"
                );


            mainButton.type =
                "button";


            mainButton.className =
                "admin-recipe-item";


            const categoryLabel =
                categoryLabels[
                recipe.category
                ] || "その他";


            mainButton.innerHTML = `

        <span class="admin-recipe-name">

          ${escapeHTML(
                recipe.name ||
                "名称未設定"
            )}

        </span>


        <span class="admin-recipe-meta">

          <span
            class="
              admin-category-badge
              ${escapeHTML(
                recipe.category
            )}
            "
          >

            ${escapeHTML(
                categoryLabel
            )}

          </span>


          <span class="sort-order-label">

            順番:
            ${Number(
                recipe.sortOrder
            ) || "-"}

          </span>


          <span>

            ${escapeHTML(
                recipe.id
            )}

          </span>

        </span>

      `;


            mainButton.addEventListener(
                "click",
                () => {

                    selectRecipe(
                        recipe.id
                    );

                }
            );


            const sortActions =
                document.createElement(
                    "div"
                );


            sortActions.className =
                "recipe-sort-actions";


            const upButton =
                document.createElement(
                    "button"
                );


            upButton.type =
                "button";


            upButton.className =
                "recipe-sort-button";


            upButton.textContent =
                "▲";


            upButton.disabled =
                categoryIndex <= 0;


            upButton.addEventListener(
                "click",
                async event => {

                    event.stopPropagation();


                    await moveRecipe(
                        recipe.id,
                        -1
                    );

                }
            );


            const downButton =
                document.createElement(
                    "button"
                );


            downButton.type =
                "button";


            downButton.className =
                "recipe-sort-button";


            downButton.textContent =
                "▼";


            downButton.disabled =
                categoryIndex === -1 ||
                categoryIndex >=
                categoryRecipes.length - 1;


            downButton.addEventListener(
                "click",
                async event => {

                    event.stopPropagation();


                    await moveRecipe(
                        recipe.id,
                        1
                    );

                }
            );


            sortActions.appendChild(
                upButton
            );


            sortActions.appendChild(
                downButton
            );


            row.appendChild(
                mainButton
            );


            row.appendChild(
                sortActions
            );


            adminRecipeList.appendChild(
                row
            );

        }
    );

}


/* =========================================================
   並び替え
========================================================= */

async function moveRecipe(
    recipeId,
    direction
) {

    const recipe =
        recipes.find(
            item =>
                item.id ===
                recipeId
        );


    if (!recipe) {

        return;

    }


    const ordered =
        getCategoryRecipesOrdered(
            recipe.category
        );


    const index =
        ordered.findIndex(
            item =>
                item.id ===
                recipeId
        );


    const newIndex =
        index + direction;


    if (
        newIndex < 0 ||
        newIndex >=
        ordered.length
    ) {

        return;

    }


    createAutomaticBackup();


    [
        ordered[index],
        ordered[newIndex]
    ] = [
            ordered[newIndex],
            ordered[index]
        ];


    ordered.forEach(
        (item, itemIndex) => {

            item.sortOrder =
                itemIndex + 1;

        }
    );


    const result =
        await saveCraftSortOrders(
            ordered
        );


    if (!result.success) {

        showToast(
            result.message,
            "error"
        );


        return;

    }


    await reloadAdminData();


    renderRecipeList();


    showToast(
        "表示順を変更しました。",
        "success"
    );

}


/* =========================================================
   選択
========================================================= */

function selectRecipe(recipeId) {

    const recipe =
        recipes.find(
            item =>
                item.id ===
                recipeId
        );


    if (!recipe) {

        return;

    }


    selectedRecipeId =
        recipe.id;


    isCreatingNewRecipe =
        false;


    openEditor();


    fillEditor(recipe);


    renderRecipeList();

}


/* =========================================================
   エディター
========================================================= */

function openEditor() {

    editorEmptyState.classList.add(
        "hidden"
    );


    recipeEditorForm.classList.remove(
        "hidden"
    );

}


function closeEditor() {

    recipeEditorForm.classList.add(
        "hidden"
    );


    editorEmptyState.classList.remove(
        "hidden"
    );


    selectedRecipeId =
        null;


    isCreatingNewRecipe =
        false;


    materialsEditor.innerHTML =
        "";


    locationsEditor.innerHTML =
        "";


    resetRecipeImage();


    updateDynamicEmptyStates();


    renderRecipeList();

}


/* =========================================================
   レシピ画像
========================================================= */

function resetRecipeImage() {

    recipeImageInput.value =
        "";


    recipeImagePath.value =
        "";


    recipeImageFile.value =
        "";


    recipeImagePreview.src =
        "";


    recipeImagePreviewWrap.classList.add(
        "hidden"
    );

}


function setRecipeImage(
    url,
    path = ""
) {

    recipeImageInput.value =
        url || "";


    recipeImagePath.value =
        path ||
        getStoragePathFromPublicUrl(
            url
        );


    recipeImageFile.value =
        "";


    if (url) {

        recipeImagePreview.src =
            url;


        recipeImagePreviewWrap.classList.remove(
            "hidden"
        );

    } else {

        recipeImagePreview.src =
            "";


        recipeImagePreviewWrap.classList.add(
            "hidden"
        );

    }

}


/* =========================================================
   フォーム反映
========================================================= */

function fillEditor(recipe) {

    editorTitle.textContent =
        recipe.name ||
        "レシピ編集";


    recipeIdInput.value =
        recipe.id || "";


    recipeIdInput.disabled =
        !isCreatingNewRecipe;


    recipeCategoryInput.value =
        recipe.category ||
        "weapon";


    recipeNameInput.value =
        recipe.name || "";


    recipeDescriptionInput.value =
        recipe.description || "";


    setRecipeImage(
        recipe.image || ""
    );


    recipeNotesInput.value =
        recipe.notes || "";


    renderMaterialEditors(
        recipe.materials || []
    );


    renderLocationEditors(
        recipe.locations || []
    );

}


/* =========================================================
   新規作成
========================================================= */

function createNewRecipe() {

    selectedRecipeId =
        null;


    isCreatingNewRecipe =
        true;


    const category =
        adminCategoryFilter.value !==
            "all"
            ? adminCategoryFilter.value
            : "weapon";


    const recipe = {

        id:
            generateRecipeId(
                category
            ),

        category,

        name: "",

        sortOrder:
            getNextSortOrder(
                category
            ),

        description: "",

        image: "",

        materials: [],

        locations: [],

        notes: ""

    };


    openEditor();


    fillEditor(recipe);


    editorTitle.textContent =
        "新しいレシピ";


    recipeIdInput.disabled =
        false;


    recipeNameInput.focus();


    renderRecipeList();

}


/* =========================================================
   ID生成
========================================================= */

function generateRecipeId(
    category
) {

    let number =
        1;


    while (true) {

        const id =
            `${category}-${String(number).padStart(3, "0")}`;


        if (
            !recipes.some(
                recipe =>
                    recipe.id === id
            )
        ) {

            return id;

        }


        number++;

    }

}


/* =========================================================
   新規カテゴリー変更
========================================================= */

function handleCategoryChange() {

    if (
        !isCreatingNewRecipe
    ) {

        return;

    }


    const pattern =
        /^(weapon|handicraft|special|food)-\d{3}$/;


    if (
        recipeIdInput.value === "" ||
        pattern.test(
            recipeIdInput.value
        )
    ) {

        recipeIdInput.value =
            generateRecipeId(
                recipeCategoryInput.value
            );

    }

}


/* =========================================================
   素材
========================================================= */

function renderMaterialEditors(
    materials
) {

    materialsEditor.innerHTML =
        "";


    materials.forEach(
        material => {

            addMaterialEditor(
                material
            );

        }
    );


    updateDynamicEmptyStates();

}


function addMaterialEditor(
    material = {
        name: "",
        amount: 1
    }
) {

    const fragment =
        materialTemplate.content
            .cloneNode(true);


    const item =
        fragment.querySelector(
            ".material-editor-item"
        );


    fragment.querySelector(
        ".material-name-input"
    ).value =
        material.name || "";


    fragment.querySelector(
        ".material-amount-input"
    ).value =
        Number(
            material.amount
        ) || 1;


    fragment.querySelector(
        ".remove-material-button"
    ).addEventListener(
        "click",
        () => {

            item.remove();


            updateMaterialLabels();

            updateDynamicEmptyStates();

        }
    );


    materialsEditor.appendChild(
        fragment
    );


    updateMaterialLabels();

    updateDynamicEmptyStates();

}


function updateMaterialLabels() {

    materialsEditor
        .querySelectorAll(
            ".material-editor-item"
        )
        .forEach(
            (item, index) => {

                const title =
                    item.querySelector(
                        ".dynamic-card-header strong"
                    );


                if (title) {

                    title.textContent =
                        `素材 ${index + 1}`;

                }

            }
        );

}


/* =========================================================
   場所
========================================================= */

function renderLocationEditors(
    locations
) {

    locationsEditor.innerHTML =
        "";


    locations.forEach(
        location => {

            addLocationEditor(
                location
            );

        }
    );


    updateDynamicEmptyStates();

}


/* =========================================================
   場所追加
========================================================= */

function addLocationEditor(
    location = {
        name: "",
        address: "",
        fieldImage: "",
        mapImage: "",
        description: ""
    }
) {

    const fragment =
        locationTemplate.content
            .cloneNode(true);


    const item =
        fragment.querySelector(
            ".location-editor-item"
        );


    const nameInput =
        fragment.querySelector(
            ".location-name-input"
        );


    const addressInput =
        fragment.querySelector(
            ".location-address-input"
        );


    const fieldFile =
        fragment.querySelector(
            ".location-field-image-file"
        );


    const fieldInput =
        fragment.querySelector(
            ".location-field-image-input"
        );


    const fieldPath =
        fragment.querySelector(
            ".location-field-image-path"
        );


    const fieldPreviewWrap =
        fragment.querySelector(
            ".location-field-preview-wrap"
        );


    const fieldPreview =
        fragment.querySelector(
            ".location-field-preview"
        );


    const removeFieldButton =
        fragment.querySelector(
            ".remove-field-image-button"
        );


    const mapFile =
        fragment.querySelector(
            ".location-map-image-file"
        );


    const mapInput =
        fragment.querySelector(
            ".location-map-image-input"
        );


    const mapPath =
        fragment.querySelector(
            ".location-map-image-path"
        );


    const mapPreviewWrap =
        fragment.querySelector(
            ".location-map-preview-wrap"
        );


    const mapPreview =
        fragment.querySelector(
            ".location-map-preview"
        );


    const removeMapButton =
        fragment.querySelector(
            ".remove-map-image-button"
        );


    const descriptionInput =
        fragment.querySelector(
            ".location-description-input"
        );


    nameInput.value =
        location.name || "";


    addressInput.value =
        location.address || "";


    descriptionInput.value =
        location.description || "";


    function setFieldImage(
        url,
        path = ""
    ) {

        fieldInput.value =
            url || "";


        fieldPath.value =
            path ||
            getStoragePathFromPublicUrl(
                url
            );


        fieldFile.value =
            "";


        if (url) {

            fieldPreview.src =
                url;


            fieldPreviewWrap.classList.remove(
                "hidden"
            );

        } else {

            fieldPreview.src =
                "";


            fieldPreviewWrap.classList.add(
                "hidden"
            );

        }

    }


    function setMapImage(
        url,
        path = ""
    ) {

        mapInput.value =
            url || "";


        mapPath.value =
            path ||
            getStoragePathFromPublicUrl(
                url
            );


        mapFile.value =
            "";


        if (url) {

            mapPreview.src =
                url;


            mapPreviewWrap.classList.remove(
                "hidden"
            );

        } else {

            mapPreview.src =
                "";


            mapPreviewWrap.classList.add(
                "hidden"
            );

        }

    }


    setFieldImage(
        location.fieldImage || ""
    );


    setMapImage(
        location.mapImage || ""
    );


    fieldFile.addEventListener(
        "change",
        async () => {

            const file =
                fieldFile.files[0];


            if (!file) {
                return;
            }


            if (
                !file.type ||
                !file.type.startsWith("image/")
            ) {

                showToast(
                    "画像ファイルを選択してください。",
                    "error"
                );

                fieldFile.value = "";

                return;
            }


            /* 選択直後にローカルプレビュー */

            const localURL =
                URL.createObjectURL(file);


            fieldPreview.src =
                localURL;


            fieldPreviewWrap
                .classList
                .remove("hidden");


            const oldPath =
                fieldPath.value;


            showToast(
                "現地画像をアップロード中..."
            );


            try {

                const result =
                    await uploadCraftImage(
                        file,
                        "field"
                    );


                if (
                    !result ||
                    !result.success
                ) {

                    throw new Error(
                        result?.message ||
                        "現地画像のアップロードに失敗しました。"
                    );
                }


                if (
                    !result.url ||
                    !result.url.startsWith("http")
                ) {

                    throw new Error(
                        "現地画像の公開URLを取得できませんでした。"
                    );
                }


                /* Supabase画像が本当に読めるか確認 */

                const checkImage =
                    new Image();


                checkImage.onload =
                    async () => {

                        fieldInput.value =
                            result.url;


                        fieldPath.value =
                            result.path;


                        fieldPreview.src =
                            result.url;


                        fieldPreviewWrap
                            .classList
                            .remove("hidden");


                        /*
                          新画像が正常なのを確認してから
                          古い画像を削除
                        */

                        if (
                            oldPath &&
                            oldPath !== result.path
                        ) {

                            await deleteCraftImage(
                                oldPath
                            );
                        }


                        URL.revokeObjectURL(
                            localURL
                        );


                        showToast(
                            "現地画像をアップロードしました。",
                            "success"
                        );

                    };


                checkImage.onerror =
                    () => {

                        console.error(
                            "現地画像URLを読み込めません:",
                            result.url
                        );


                        fieldPreview.src =
                            localURL;


                        showToast(
                            "現地画像の公開URLを読み込めません。",
                            "error"
                        );

                    };


                checkImage.src =
                    result.url;


            } catch (error) {

                console.error(
                    "現地画像アップロードエラー:",
                    error
                );


                fieldPreview.src =
                    localURL;


                showToast(
                    error.message ||
                    "現地画像のアップロードに失敗しました。",
                    "error"
                );

            }

        }
    );


    mapFile.addEventListener(
        "change",
        async () => {

            const file =
                mapFile.files[0];


            if (!file) {
                return;
            }


            if (
                !file.type ||
                !file.type.startsWith("image/")
            ) {

                showToast(
                    "画像ファイルを選択してください。",
                    "error"
                );

                mapFile.value = "";

                return;
            }


            /* 選択直後にローカルプレビュー */

            const localURL =
                URL.createObjectURL(file);


            mapPreview.src =
                localURL;


            mapPreviewWrap
                .classList
                .remove("hidden");


            const oldPath =
                mapPath.value;


            showToast(
                "マップ画像をアップロード中..."
            );


            try {

                const result =
                    await uploadCraftImage(
                        file,
                        "maps"
                    );


                if (
                    !result ||
                    !result.success
                ) {

                    throw new Error(
                        result?.message ||
                        "マップ画像のアップロードに失敗しました。"
                    );
                }


                if (
                    !result.url ||
                    !result.url.startsWith("http")
                ) {

                    throw new Error(
                        "マップ画像の公開URLを取得できませんでした。"
                    );
                }


                const checkImage =
                    new Image();


                checkImage.onload =
                    async () => {

                        mapInput.value =
                            result.url;


                        mapPath.value =
                            result.path;


                        mapPreview.src =
                            result.url;


                        mapPreviewWrap
                            .classList
                            .remove("hidden");


                        if (
                            oldPath &&
                            oldPath !== result.path
                        ) {

                            await deleteCraftImage(
                                oldPath
                            );
                        }


                        URL.revokeObjectURL(
                            localURL
                        );


                        showToast(
                            "マップ画像をアップロードしました。",
                            "success"
                        );

                    };


                checkImage.onerror =
                    () => {

                        console.error(
                            "マップ画像URLを読み込めません:",
                            result.url
                        );


                        mapPreview.src =
                            localURL;


                        showToast(
                            "マップ画像の公開URLを読み込めません。",
                            "error"
                        );

                    };


                checkImage.src =
                    result.url;


            } catch (error) {

                console.error(
                    "マップ画像アップロードエラー:",
                    error
                );


                mapPreview.src =
                    localURL;


                showToast(
                    error.message ||
                    "マップ画像のアップロードに失敗しました。",
                    "error"
                );

            }

        }
    );


    removeFieldButton.addEventListener(
        "click",
        async () => {

            const path =
                fieldPath.value;


            if (path) {

                await deleteCraftImage(
                    path
                );

            }


            setFieldImage("");

        }
    );


    removeMapButton.addEventListener(
        "click",
        async () => {

            const path =
                mapPath.value;


            if (path) {

                await deleteCraftImage(
                    path
                );

            }


            setMapImage("");

        }
    );


    fragment.querySelector(
        ".remove-location-button"
    ).addEventListener(
        "click",
        () => {

            item.remove();


            updateLocationLabels();

            updateDynamicEmptyStates();

        }
    );


    locationsEditor.appendChild(
        fragment
    );


    updateLocationLabels();

    updateDynamicEmptyStates();

}


/* =========================================================
   場所番号
========================================================= */

function updateLocationLabels() {

    locationsEditor
        .querySelectorAll(
            ".location-editor-item"
        )
        .forEach(
            (item, index) => {

                const title =
                    item.querySelector(
                        ".dynamic-card-header strong"
                    );


                if (title) {

                    title.textContent =
                        `クラフト場所 ${index + 1}`;

                }

            }
        );

}


/* =========================================================
   空状態
========================================================= */

function updateDynamicEmptyStates() {

    materialsEmpty.classList.toggle(
        "hidden",
        materialsEditor.children.length > 0
    );


    locationsEmpty.classList.toggle(
        "hidden",
        locationsEditor.children.length > 0
    );

}

/* =========================================================
   レシピ画像アップロード
========================================================= */

async function handleRecipeImageUpload() {

    const file =
        recipeImageFile.files[0];

    if (!file) {
        return;
    }

    if (
        !file.type ||
        !file.type.startsWith("image/")
    ) {
        showToast(
            "画像ファイルを選択してください。",
            "error"
        );

        recipeImageFile.value = "";
        return;
    }


    /* ① PC上の画像をまずプレビュー */

    const localURL =
        URL.createObjectURL(file);

    recipeImagePreview.src =
        localURL;

    recipeImagePreviewWrap
        .classList
        .remove("hidden");


    showToast(
        "画像をアップロード中..."
    );


    try {

        /* ② Supabaseへアップロード */

        const result =
            await uploadCraftImage(
                file,
                "recipes"
            );


        console.log(
            "upload result:",
            result
        );


        if (
            !result ||
            !result.success
        ) {
            throw new Error(
                result?.message ||
                "画像アップロードに失敗しました。"
            );
        }


        console.log(
            "Supabase image URL:",
            result.url
        );


        /* ③ 公開URLが本当に画像として開けるか確認 */

        const checkImage =
            new Image();


        checkImage.onload =
            async () => {

                recipeImageInput.value =
                    result.url;

                recipeImagePath.value =
                    result.path;


                /* 正常確認後にSupabase URLへ切替 */

                recipeImagePreview.src =
                    result.url;


                showToast(
                    "画像をアップロードしました。",
                    "success"
                );


                URL.revokeObjectURL(
                    localURL
                );

            };


        checkImage.onerror =
            () => {

                console.error(
                    "Supabase画像を読み込めません:",
                    result.url
                );


                /* 壊れたURLへ切り替えない */
                recipeImagePreview.src =
                    localURL;


                showToast(
                    "Storageへのアップロード後の画像URLを読み込めません。",
                    "error"
                );

            };


        checkImage.src =
            result.url;


    } catch (error) {

        console.error(
            "画像アップロードエラー:",
            error
        );


        /* PC上のプレビューは残す */
        recipeImagePreview.src =
            localURL;


        showToast(
            error.message ||
            "画像アップロードに失敗しました。",
            "error"
        );

    }

}

/* =========================================================
   レシピ画像削除
========================================================= */

async function removeRecipeImage() {

    const path =
        recipeImagePath.value;


    if (path) {

        await deleteCraftImage(
            path
        );

    }


    setRecipeImage("");

}


/* =========================================================
   フォーム取得
========================================================= */

function collectMaterials() {

    return Array.from(
        materialsEditor.querySelectorAll(
            ".material-editor-item"
        )
    )
        .map(
            item => ({

                name:
                    item.querySelector(
                        ".material-name-input"
                    ).value.trim(),

                amount:
                    Number(
                        item.querySelector(
                            ".material-amount-input"
                        ).value
                    ) || 0

            })
        )
        .filter(
            material =>
                material.name !== ""
        );

}


function collectLocations() {

    return Array.from(
        locationsEditor.querySelectorAll(
            ".location-editor-item"
        )
    )
        .map(
            item => ({

                name:
                    item.querySelector(
                        ".location-name-input"
                    ).value.trim(),

                address:
                    item.querySelector(
                        ".location-address-input"
                    ).value.trim(),

                fieldImage:
                    item.querySelector(
                        ".location-field-image-input"
                    ).value,

                mapImage:
                    item.querySelector(
                        ".location-map-image-input"
                    ).value,

                description:
                    item.querySelector(
                        ".location-description-input"
                    ).value.trim()

            })
        )
        .filter(
            location =>
                location.name !== ""
        );

}


function collectRecipeFromForm() {

    const existing =
        recipes.find(
            recipe =>
                recipe.id ===
                selectedRecipeId
        );


    const category =
        recipeCategoryInput.value;


    let sortOrder;


    if (
        isCreatingNewRecipe
    ) {

        sortOrder =
            getNextSortOrder(
                category
            );

    } else if (
        existing &&
        existing.category ===
        category
    ) {

        sortOrder =
            existing.sortOrder;

    } else {

        sortOrder =
            getNextSortOrder(
                category
            );

    }


    return {

        id:
            recipeIdInput.value.trim(),

        category,

        name:
            recipeNameInput.value.trim(),

        sortOrder:
            Number(
                sortOrder
            ) || 1,

        description:
            recipeDescriptionInput.value.trim(),

        image:
            recipeImageInput.value,

        materials:
            collectMaterials(),

        locations:
            collectLocations(),

        notes:
            recipeNotesInput.value.trim()

    };

}


/* =========================================================
   保存
========================================================= */

async function handleSave(event) {

    event.preventDefault();


    if (isSaving) {

        return;

    }


    const recipe =
        collectRecipeFromForm();


    if (!recipe.id) {

        showToast(
            "レシピIDを入力してください。",
            "error"
        );


        return;

    }


    if (!recipe.name) {

        showToast(
            "クラフト名を入力してください。",
            "error"
        );


        return;

    }


    if (
        isCreatingNewRecipe &&
        recipes.some(
            item =>
                item.id ===
                recipe.id
        )
    ) {

        showToast(
            "同じレシピIDが存在します。",
            "error"
        );


        return;

    }


    isSaving =
        true;


    createAutomaticBackup();


    showToast(
        "Supabaseへ保存中..."
    );


    try {

        const result =
            await saveCraftRecipe(
                recipe
            );


        if (!result.success) {

            showToast(
                result.message,
                "error"
            );


            return;

        }


        selectedRecipeId =
            recipe.id;


        isCreatingNewRecipe =
            false;


        await reloadAdminData();


        renderRecipeList();


        const savedRecipe =
            recipes.find(
                item =>
                    item.id ===
                    recipe.id
            );


        if (savedRecipe) {

            fillEditor(
                savedRecipe
            );

        }


        showToast(
            "レシピを保存しました。",
            "success"
        );

    } finally {

        isSaving =
            false;

    }

}


/* =========================================================
   削除
========================================================= */

function openDeleteModal() {

    if (
        isCreatingNewRecipe
    ) {

        closeEditor();

        return;

    }


    if (!selectedRecipeId) {

        return;

    }


    deleteConfirmModal.classList.add(
        "active"
    );


    deleteConfirmModal.setAttribute(
        "aria-hidden",
        "false"
    );

}


function closeDeleteModal() {

    deleteConfirmModal.classList.remove(
        "active"
    );


    deleteConfirmModal.setAttribute(
        "aria-hidden",
        "true"
    );

}


async function deleteSelectedRecipe() {

    if (!selectedRecipeId) {

        return;

    }


    createAutomaticBackup();


    const recipe =
        recipes.find(
            item =>
                item.id ===
                selectedRecipeId
        );


    /*
      画像もStorageから削除
    */

    const imagePaths =
        [];


    if (recipe?.image) {

        imagePaths.push(
            getStoragePathFromPublicUrl(
                recipe.image
            )
        );

    }


    (recipe?.locations || [])
        .forEach(
            location => {

                if (location.fieldImage) {

                    imagePaths.push(
                        getStoragePathFromPublicUrl(
                            location.fieldImage
                        )
                    );

                }


                if (location.mapImage) {

                    imagePaths.push(
                        getStoragePathFromPublicUrl(
                            location.mapImage
                        )
                    );

                }

            }
        );


    const result =
        await deleteCraftRecipe(
            selectedRecipeId
        );


    if (!result.success) {

        showToast(
            result.message,
            "error"
        );


        return;

    }


    for (
        const path
        of imagePaths
    ) {

        if (path) {

            await deleteCraftImage(
                path
            );

        }

    }


    closeDeleteModal();


    await reloadAdminData();


    closeEditor();


    showToast(
        "レシピを削除しました。",
        "success"
    );

}


/* =========================================================
   JSON書き出し
========================================================= */

function openExportModal() {

    exportTextarea.value =
        JSON.stringify(
            recipes,
            null,
            2
        );


    exportModal.classList.add(
        "active"
    );


    exportModal.setAttribute(
        "aria-hidden",
        "false"
    );

}


function closeExportModal() {

    exportModal.classList.remove(
        "active"
    );


    exportModal.setAttribute(
        "aria-hidden",
        "true"
    );

}


async function copyExportData() {

    try {

        await navigator.clipboard.writeText(
            exportTextarea.value
        );


        showToast(
            "コピーしました。",
            "success"
        );

    } catch (error) {

        exportTextarea.select();


        document.execCommand(
            "copy"
        );

    }

}


function downloadExportData() {

    const blob =
        new Blob(
            [
                exportTextarea.value
            ],
            {
                type:
                    "application/json;charset=utf-8"
            }
        );


    const url =
        URL.createObjectURL(
            blob
        );


    const link =
        document.createElement(
            "a"
        );


    link.href =
        url;


    link.download =
        "craft-recipes.json";


    link.click();


    URL.revokeObjectURL(
        url
    );

}


/* =========================================================
   JSON読み込み
========================================================= */

function openImportModal() {

    importFileInput.value =
        "";


    importTextarea.value =
        "";


    importModal.classList.add(
        "active"
    );


    importModal.setAttribute(
        "aria-hidden",
        "false"
    );

}


function closeImportModal() {

    importModal.classList.remove(
        "active"
    );


    importModal.setAttribute(
        "aria-hidden",
        "true"
    );

}


async function handleImportFile() {

    const file =
        importFileInput.files[0];


    if (!file) {

        return;

    }


    importTextarea.value =
        await file.text();

}


/* =========================================================
   JSONをSupabaseへインポート
========================================================= */

async function executeImport() {

    let imported;


    try {

        imported =
            JSON.parse(
                importTextarea.value
            );

    } catch (error) {

        showToast(
            "JSON形式が正しくありません。",
            "error"
        );


        return;

    }


    if (
        !Array.isArray(imported)
    ) {

        showToast(
            "JSONはレシピ配列である必要があります。",
            "error"
        );


        return;

    }


    createAutomaticBackup();


    showToast(
        "Supabaseへ読み込み中..."
    );


    for (
        let index = 0;
        index < imported.length;
        index++
    ) {

        const recipe =
            imported[index];


        recipe.sortOrder =
            Number(
                recipe.sortOrder
            ) || (
                index + 1
            );


        const result =
            await saveCraftRecipe(
                recipe
            );


        if (!result.success) {

            showToast(
                `${recipe.name || "レシピ"}の読み込みに失敗しました。`,
                "error"
            );


            return;

        }

    }


    await reloadAdminData();


    closeImportModal();

    closeEditor();

    renderRecipeList();


    showToast(
        "JSONデータをSupabaseへ読み込みました。",
        "success"
    );

}


/* =========================================================
   ローカルバックアップ
========================================================= */

function createAutomaticBackup() {

    try {

        localStorage.setItem(
            BACKUP_STORAGE_KEY,
            JSON.stringify({
                savedAt:
                    new Date().toISOString(),

                recipes:
                    cloneData(recipes)
            })
        );


        return true;

    } catch (error) {

        console.error(error);


        return false;

    }

}


function loadBackup() {

    try {

        const raw =
            localStorage.getItem(
                BACKUP_STORAGE_KEY
            );


        if (!raw) {

            return null;

        }


        const backup =
            JSON.parse(raw);


        return Array.isArray(
            backup?.recipes
        )
            ? backup
            : null;

    } catch (error) {

        return null;

    }

}


/* =========================================================
   バックアップ
========================================================= */

function openBackupModal() {

    const backup =
        loadBackup();


    if (!backup) {

        backupDescription.textContent =
            "復元できるバックアップはありません。";


        restoreBackupButton.disabled =
            true;

    } else {

        backupDescription.textContent =
            `バックアップ日時：${new Date(
                backup.savedAt
            ).toLocaleString("ja-JP")}
Supabaseへこの内容を復元できます。`;


        restoreBackupButton.disabled =
            false;

    }


    backupModal.classList.add(
        "active"
    );


    backupModal.setAttribute(
        "aria-hidden",
        "false"
    );

}


function closeBackupModal() {

    backupModal.classList.remove(
        "active"
    );


    backupModal.setAttribute(
        "aria-hidden",
        "true"
    );

}


async function restoreBackup() {

    const backup =
        loadBackup();


    if (!backup) {

        return;

    }


    for (
        const recipe
        of backup.recipes
    ) {

        const result =
            await saveCraftRecipe(
                recipe
            );


        if (!result.success) {

            showToast(
                "復元中にエラーが発生しました。",
                "error"
            );


            return;

        }

    }


    await reloadAdminData();


    closeBackupModal();

    closeEditor();

    renderRecipeList();


    showToast(
        "バックアップを復元しました。",
        "success"
    );

}


/* =========================================================
   全データ削除
========================================================= */

function openResetModal() {

    resetConfirmModal.classList.add(
        "active"
    );


    resetConfirmModal.setAttribute(
        "aria-hidden",
        "false"
    );

}


function closeResetModal() {

    resetConfirmModal.classList.remove(
        "active"
    );


    resetConfirmModal.setAttribute(
        "aria-hidden",
        "true"
    );

}


async function executeReset() {

    createAutomaticBackup();


    const copy =
        [...recipes];


    for (
        const recipe
        of copy
    ) {

        const result =
            await deleteCraftRecipe(
                recipe.id
            );


        if (!result.success) {

            showToast(
                "全データ削除中にエラーが発生しました。",
                "error"
            );


            return;

        }

    }


    await reloadAdminData();


    closeResetModal();

    closeEditor();

    renderRecipeList();


    showToast(
        "Supabaseのレシピを全削除しました。",
        "success"
    );

}


/* =========================================================
   Realtime
========================================================= */

function startRealtimeSubscription() {

    if (
        realtimeChannel ||
        typeof subscribeCraftRecipeChanges !==
        "function"
    ) {

        return;

    }


    realtimeChannel =
        subscribeCraftRecipeChanges(
            async () => {

                if (isSaving) {

                    return;

                }


                const currentId =
                    selectedRecipeId;


                await reloadAdminData();


                renderRecipeList();


                if (currentId) {

                    const recipe =
                        recipes.find(
                            item =>
                                item.id ===
                                currentId
                        );


                    if (
                        recipe &&
                        !isCreatingNewRecipe
                    ) {

                        fillEditor(
                            recipe
                        );

                    }

                }

            }
        );

}


async function stopRealtimeSubscription() {

    if (
        !realtimeChannel
    ) {

        return;

    }


    await unsubscribeCraftRecipeChanges(
        realtimeChannel
    );


    realtimeChannel =
        null;

}


/* =========================================================
   管理画面初期化
========================================================= */

async function initializeAdminData() {

    await reloadAdminData();


    renderRecipeList();


    updateDynamicEmptyStates();


    startRealtimeSubscription();

}


/* =========================================================
   初期ログイン状態確認
========================================================= */

async function initializeAuthentication() {

    const user =
        await getCraftAdminUser();


    if (!user) {

        showLoginScreen();


        return;

    }


    showAdminScreen(
        user
    );


    await initializeAdminData();

}


/* =========================================================
   イベント
========================================================= */

loginForm.addEventListener(
    "submit",
    handleLogin
);


logoutButton.addEventListener(
    "click",
    handleLogout
);


addRecipeButton.addEventListener(
    "click",
    createNewRecipe
);


emptyAddRecipeButton.addEventListener(
    "click",
    createNewRecipe
);


adminSearchInput.addEventListener(
    "input",
    renderRecipeList
);


adminCategoryFilter.addEventListener(
    "change",
    renderRecipeList
);


recipeCategoryInput.addEventListener(
    "change",
    handleCategoryChange
);


recipeImageFile.addEventListener(
    "change",
    handleRecipeImageUpload
);


removeRecipeImageButton.addEventListener(
    "click",
    removeRecipeImage
);


addMaterialButton.addEventListener(
    "click",
    () => {

        addMaterialEditor();

    }
);


addLocationButton.addEventListener(
    "click",
    () => {

        addLocationEditor();

    }
);


recipeEditorForm.addEventListener(
    "submit",
    handleSave
);


cancelEditButton.addEventListener(
    "click",
    closeEditor
);


deleteRecipeButton.addEventListener(
    "click",
    openDeleteModal
);


confirmDeleteButton.addEventListener(
    "click",
    deleteSelectedRecipe
);


exportButton.addEventListener(
    "click",
    openExportModal
);


copyExportButton.addEventListener(
    "click",
    copyExportData
);


downloadExportButton.addEventListener(
    "click",
    downloadExportData
);


importButton.addEventListener(
    "click",
    openImportModal
);


importFileInput.addEventListener(
    "change",
    handleImportFile
);


executeImportButton.addEventListener(
    "click",
    executeImport
);


backupButton.addEventListener(
    "click",
    openBackupModal
);


restoreBackupButton.addEventListener(
    "click",
    restoreBackup
);


resetButton.addEventListener(
    "click",
    openResetModal
);


confirmResetButton.addEventListener(
    "click",
    executeReset
);


/* =========================================================
   モーダル閉じる
========================================================= */

document
    .querySelectorAll(
        "[data-close-delete-modal]"
    )
    .forEach(
        element => {

            element.addEventListener(
                "click",
                closeDeleteModal
            );

        }
    );


document
    .querySelectorAll(
        "[data-close-export-modal]"
    )
    .forEach(
        element => {

            element.addEventListener(
                "click",
                closeExportModal
            );

        }
    );


document
    .querySelectorAll(
        "[data-close-import-modal]"
    )
    .forEach(
        element => {

            element.addEventListener(
                "click",
                closeImportModal
            );

        }
    );


document
    .querySelectorAll(
        "[data-close-reset-modal]"
    )
    .forEach(
        element => {

            element.addEventListener(
                "click",
                closeResetModal
            );

        }
    );


document
    .querySelectorAll(
        "[data-close-backup-modal]"
    )
    .forEach(
        element => {

            element.addEventListener(
                "click",
                closeBackupModal
            );

        }
    );


/* =========================================================
   ESC
========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key !==
            "Escape"
        ) {

            return;

        }


        closeDeleteModal();

        closeExportModal();

        closeImportModal();

        closeResetModal();

        closeBackupModal();

    }
);


/* =========================================================
   起動
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    initializeAuthentication
);