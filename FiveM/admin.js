/* =========================================================
   Craft Recipe Database
   Admin Panel
   admin.js

   対応機能
   ---------------------------------------------------------
   ・レシピ追加 / 編集 / 削除
   ・素材追加 / 削除
   ・クラフト場所追加 / 削除
   ・画像アップロード / プレビュー / 削除
   ・カテゴリー別並び替え（▲ ▼）
   ・JSON読み込み / 書き出し
   ・自動バックアップ
   ・バックアップ復元
   ・初期化
========================================================= */


/* =========================================================
   設定
========================================================= */

const BACKUP_STORAGE_KEY =
    "craftRecipeDatabaseBackup";


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
   DOM
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

const editorEmptyState =
    document.getElementById("editorEmptyState");

const recipeEditorForm =
    document.getElementById("recipeEditorForm");

const editorTitle =
    document.getElementById("editorTitle");


/* =========================
   基本情報
========================= */

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

const recipeImageFile =
    document.getElementById("recipeImageFile");

const recipeImagePreviewWrap =
    document.getElementById(
        "recipeImagePreviewWrap"
    );

const recipeImagePreview =
    document.getElementById(
        "recipeImagePreview"
    );

const removeRecipeImageButton =
    document.getElementById(
        "removeRecipeImageButton"
    );

const recipeNotesInput =
    document.getElementById("recipeNotes");


/* =========================
   素材
========================= */

const materialsEditor =
    document.getElementById("materialsEditor");

const materialsEmpty =
    document.getElementById("materialsEmpty");

const materialTemplate =
    document.getElementById("materialTemplate");


/* =========================
   場所
========================= */

const locationsEditor =
    document.getElementById("locationsEditor");

const locationsEmpty =
    document.getElementById("locationsEmpty");

const locationTemplate =
    document.getElementById("locationTemplate");


/* =========================
   操作ボタン
========================= */

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


/* =========================
   削除モーダル
========================= */

const deleteConfirmModal =
    document.getElementById("deleteConfirmModal");

const confirmDeleteButton =
    document.getElementById("confirmDeleteButton");


/* =========================
   書き出し
========================= */

const exportModal =
    document.getElementById("exportModal");

const exportTextarea =
    document.getElementById("exportTextarea");

const copyExportButton =
    document.getElementById("copyExportButton");

const downloadExportButton =
    document.getElementById("downloadExportButton");


/* =========================
   読み込み
========================= */

const importModal =
    document.getElementById("importModal");

const importFileInput =
    document.getElementById("importFileInput");

const importTextarea =
    document.getElementById("importTextarea");

const executeImportButton =
    document.getElementById("executeImportButton");


/* =========================
   初期化
========================= */

const resetConfirmModal =
    document.getElementById("resetConfirmModal");

const confirmResetButton =
    document.getElementById("confirmResetButton");


/* =========================
   バックアップ
========================= */

const backupModal =
    document.getElementById("backupModal");

const backupDescription =
    document.getElementById("backupDescription");

const restoreBackupButton =
    document.getElementById("restoreBackupButton");


/* =========================
   通知
========================= */

const toast =
    document.getElementById("toast");


/* =========================================================
   状態
========================================================= */

let recipes = [];

let selectedRecipeId = null;

let isCreatingNewRecipe = false;

let toastTimer = null;


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


function cloneData(data) {

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
   画像ファイル → Base64
========================================================= */

function fileToDataURL(file) {

    return new Promise(
        (resolve, reject) => {

            if (!file) {

                resolve("");

                return;

            }


            if (
                !file.type.startsWith("image/")
            ) {

                reject(
                    new Error(
                        "画像ファイルを選択してください。"
                    )
                );

                return;

            }


            const reader =
                new FileReader();


            reader.addEventListener(
                "load",
                () => {

                    resolve(
                        String(
                            reader.result || ""
                        )
                    );

                }
            );


            reader.addEventListener(
                "error",
                () => {

                    reject(
                        new Error(
                            "画像の読み込みに失敗しました。"
                        )
                    );

                }
            );


            reader.readAsDataURL(file);

        }
    );

}


/* =========================================================
   レシピ画像
========================================================= */

function showRecipeImagePreview(image) {

    if (!image) {

        hideRecipeImagePreview();

        return;

    }


    recipeImagePreview.src =
        image;


    recipeImagePreviewWrap
        .classList
        .remove("hidden");

}


function hideRecipeImagePreview() {

    recipeImagePreview.src =
        "";


    recipeImagePreviewWrap
        .classList
        .add("hidden");

}


async function handleRecipeImageFile() {

    const file =
        recipeImageFile.files[0];


    if (!file) {

        return;

    }


    try {

        const dataURL =
            await fileToDataURL(file);


        recipeImageInput.value =
            dataURL;


        showRecipeImagePreview(
            dataURL
        );


        showToast(
            "レシピ画像を読み込みました。",
            "success"
        );

    } catch (error) {

        console.error(error);


        recipeImageFile.value =
            "";


        showToast(
            error.message ||
            "画像の読み込みに失敗しました。",
            "error"
        );

    }

}


function removeRecipeImage() {

    recipeImageInput.value =
        "";


    recipeImageFile.value =
        "";


    hideRecipeImagePreview();

}


/* =========================================================
   データ読み込み
========================================================= */

function reloadAdminData() {

    if (
        typeof loadCraftRecipes !==
        "function"
    ) {

        recipes = [];


        console.error(
            "data.js が読み込まれていません。"
        );


        showToast(
            "data.js が読み込まれていません。",
            "error"
        );


        return false;

    }


    recipes =
        loadCraftRecipes();


    if (
        !Array.isArray(recipes)
    ) {

        recipes = [];

    }


    return true;

}


/* =========================================================
   保存
========================================================= */

function persistRecipes() {

    if (
        typeof saveCraftRecipes !==
        "function"
    ) {

        showToast(
            "data.js が読み込まれていません。",
            "error"
        );


        return false;

    }


    const success =
        saveCraftRecipes(
            recipes
        );


    if (!success) {

        showToast(
            "保存に失敗しました。画像容量が大きすぎる可能性があります。",
            "error"
        );

    }


    return success;

}


/* =========================================================
   自動バックアップ
========================================================= */

function createAutomaticBackup() {

    try {

        const backup = {

            savedAt:
                new Date()
                    .toISOString(),

            recipes:
                cloneData(
                    recipes
                )

        };


        localStorage.setItem(
            BACKUP_STORAGE_KEY,
            JSON.stringify(
                backup
            )
        );


        return true;

    } catch (error) {

        console.error(
            "バックアップ作成失敗",
            error
        );


        return false;

    }

}


/* =========================================================
   バックアップ取得
========================================================= */

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


        if (
            !backup ||
            !Array.isArray(
                backup.recipes
            )
        ) {

            return null;

        }


        return backup;

    } catch (error) {

        console.error(
            "バックアップ読込失敗",
            error
        );


        return null;

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

                const orderA =
                    Number(
                        a.sortOrder
                    ) || 9999;

                const orderB =
                    Number(
                        b.sortOrder
                    ) || 9999;


                if (
                    orderA !== orderB
                ) {

                    return (
                        orderA -
                        orderB
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


/* =========================================================
   次の表示順
========================================================= */

function getNextSortOrder(
    category
) {

    const categoryRecipes =
        recipes.filter(
            recipe =>
                recipe.category ===
                category
        );


    if (
        categoryRecipes.length === 0
    ) {

        return 1;

    }


    const maxOrder =
        Math.max(
            ...categoryRecipes.map(
                recipe =>
                    Number(
                        recipe.sortOrder
                    ) || 0
            )
        );


    return (
        maxOrder + 1
    );

}


/* =========================================================
   カテゴリーごとの順番を1,2,3...に整理
========================================================= */

function renumberCategory(
    category
) {

    const ordered =
        getCategoryRecipesOrdered(
            category
        );


    ordered.forEach(
        (recipe, index) => {

            recipe.sortOrder =
                index + 1;

        }
    );

}


/* =========================================================
   上へ移動
========================================================= */

function moveRecipeUp(
    recipeId
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


    const categoryRecipes =
        getCategoryRecipesOrdered(
            recipe.category
        );


    const index =
        categoryRecipes.findIndex(
            item =>
                item.id ===
                recipeId
        );


    if (
        index <= 0
    ) {

        return;

    }


    createAutomaticBackup();


    const previousRecipe =
        categoryRecipes[
        index - 1
        ];


    const currentOrder =
        Number(
            recipe.sortOrder
        ) || (
            index + 1
        );


    const previousOrder =
        Number(
            previousRecipe.sortOrder
        ) || index;


    recipe.sortOrder =
        previousOrder;


    previousRecipe.sortOrder =
        currentOrder;


    renumberCategory(
        recipe.category
    );


    if (
        !persistRecipes()
    ) {

        return;

    }


    reloadAdminData();

    renderRecipeList();


    showToast(
        "表示順を変更しました。",
        "success"
    );

}


/* =========================================================
   下へ移動
========================================================= */

function moveRecipeDown(
    recipeId
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


    const categoryRecipes =
        getCategoryRecipesOrdered(
            recipe.category
        );


    const index =
        categoryRecipes.findIndex(
            item =>
                item.id ===
                recipeId
        );


    if (
        index === -1 ||
        index >=
        categoryRecipes.length - 1
    ) {

        return;

    }


    createAutomaticBackup();


    const nextRecipe =
        categoryRecipes[
        index + 1
        ];


    const currentOrder =
        Number(
            recipe.sortOrder
        ) || (
            index + 1
        );


    const nextOrder =
        Number(
            nextRecipe.sortOrder
        ) || (
            index + 2
        );


    recipe.sortOrder =
        nextOrder;


    nextRecipe.sortOrder =
        currentOrder;


    renumberCategory(
        recipe.category
    );


    if (
        !persistRecipes()
    ) {

        return;

    }


    reloadAdminData();

    renderRecipeList();


    showToast(
        "表示順を変更しました。",
        "success"
    );

}


/* =========================================================
   レシピ一覧絞り込み
========================================================= */

function getFilteredRecipes() {

    const keyword =
        adminSearchInput.value
            .trim()
            .toLowerCase();


    const category =
        adminCategoryFilter.value;


    return recipes.filter(
        recipe => {

            const categoryMatch =
                category === "all" ||
                recipe.category ===
                category;


            const materialsText =
                Array.isArray(
                    recipe.materials
                )
                    ? recipe.materials
                        .map(
                            item =>
                                item.name || ""
                        )
                        .join(" ")
                    : "";


            const locationsText =
                Array.isArray(
                    recipe.locations
                )
                    ? recipe.locations
                        .map(
                            item => `
                  ${item.name || ""}
                  ${item.address || ""}
                `
                        )
                        .join(" ")
                    : "";


            const searchText = `
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
                    searchText.includes(
                        keyword
                    )
                )
            );

        }
    );

}


/* =========================================================
   レシピ一覧描画
========================================================= */

function renderRecipeList() {

    const filtered =
        getFilteredRecipes();


    /*
      カテゴリー順
      ↓
      sortOrder順
    */

    filtered.sort(
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


    adminRecipeList.innerHTML =
        "";


    adminRecipeCount.textContent =
        filtered.length;


    if (
        filtered.length === 0
    ) {

        adminRecipeList
            .classList
            .add("hidden");


        adminEmptyState
            .classList
            .remove("hidden");


        return;

    }


    adminRecipeList
        .classList
        .remove("hidden");


    adminEmptyState
        .classList
        .add("hidden");


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


            const wrapper =
                document.createElement(
                    "div"
                );


            wrapper.className =
                "admin-recipe-row";


            wrapper.dataset.recipeId =
                recipe.id;


            if (
                recipe.id ===
                selectedRecipeId
            ) {

                wrapper.classList.add(
                    "active"
                );

            }


            /* =========================
               レシピ選択ボタン
            ========================= */

            const mainButton =
                document.createElement(
                    "button"
                );


            mainButton.type =
                "button";


            mainButton.className =
                "admin-recipe-item";


            mainButton.dataset.recipeId =
                recipe.id;


            const label =
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
                label
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


            /* =========================
               並び替え操作
            ========================= */

            const sortActions =
                document.createElement(
                    "div"
                );


            sortActions.className =
                "recipe-sort-actions";


            /* 上へ */

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


            upButton.title =
                "上へ移動";


            upButton.setAttribute(
                "aria-label",
                `${recipe.name}を上へ移動`
            );


            upButton.disabled =
                categoryIndex <= 0;


            upButton.addEventListener(
                "click",
                event => {

                    event.preventDefault();

                    event.stopPropagation();


                    moveRecipeUp(
                        recipe.id
                    );

                }
            );


            /* 下へ */

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


            downButton.title =
                "下へ移動";


            downButton.setAttribute(
                "aria-label",
                `${recipe.name}を下へ移動`
            );


            downButton.disabled =
                categoryIndex === -1 ||
                categoryIndex >=
                categoryRecipes.length - 1;


            downButton.addEventListener(
                "click",
                event => {

                    event.preventDefault();

                    event.stopPropagation();


                    moveRecipeDown(
                        recipe.id
                    );

                }
            );


            sortActions.appendChild(
                upButton
            );


            sortActions.appendChild(
                downButton
            );


            wrapper.appendChild(
                mainButton
            );


            wrapper.appendChild(
                sortActions
            );


            adminRecipeList.appendChild(
                wrapper
            );

        }
    );

}


/* =========================================================
   レシピ選択
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


    fillEditor(
        recipe
    );


    renderRecipeList();

}


/* =========================================================
   エディター
========================================================= */

function openEditor() {

    editorEmptyState
        .classList
        .add("hidden");


    recipeEditorForm
        .classList
        .remove("hidden");

}


function closeEditor() {

    recipeEditorForm
        .classList
        .add("hidden");


    editorEmptyState
        .classList
        .remove("hidden");


    selectedRecipeId =
        null;


    isCreatingNewRecipe =
        false;


    removeRecipeImage();


    materialsEditor.innerHTML =
        "";


    locationsEditor.innerHTML =
        "";


    updateDynamicEmptyStates();


    renderRecipeList();

}


/* =========================================================
   フォーム反映
========================================================= */

function fillEditor(recipe) {

    editorTitle.textContent =
        recipe.name ||
        "レシピ編集";


    recipeIdInput.value =
        recipe.id ||
        "";


    recipeCategoryInput.value =
        recipe.category ||
        "weapon";


    recipeNameInput.value =
        recipe.name ||
        "";


    recipeDescriptionInput.value =
        recipe.description ||
        "";


    recipeImageInput.value =
        recipe.image ||
        "";


    recipeImageFile.value =
        "";


    if (
        recipe.image
    ) {

        showRecipeImagePreview(
            recipe.image
        );

    } else {

        hideRecipeImagePreview();

    }


    recipeNotesInput.value =
        recipe.notes ||
        "";


    renderMaterialEditors(
        recipe.materials ||
        []
    );


    renderLocationEditors(
        recipe.locations ||
        []
    );

}


/* =========================================================
   新規レシピ
========================================================= */

function createNewRecipe() {

    selectedRecipeId =
        null;


    isCreatingNewRecipe =
        true;


    const initialCategory =
        adminCategoryFilter.value !==
            "all"
            ? adminCategoryFilter.value
            : "weapon";


    const newRecipe = {

        id:
            generateRecipeId(
                initialCategory
            ),

        category:
            initialCategory,

        name:
            "",

        sortOrder:
            getNextSortOrder(
                initialCategory
            ),

        description:
            "",

        image:
            "",

        materials:
            [],

        locations:
            [],

        notes:
            ""

    };


    openEditor();


    fillEditor(
        newRecipe
    );


    editorTitle.textContent =
        "新しいレシピ";


    recipeNameInput.focus();


    renderRecipeList();

}


/* =========================================================
   ID生成
========================================================= */

function generateRecipeId(
    category
) {

    const prefix =
        category ||
        "recipe";


    let number =
        1;


    while (true) {

        const candidate =
            `${prefix}-${String(number).padStart(3, "0")}`;


        const exists =
            recipes.some(
                recipe =>
                    recipe.id ===
                    candidate
            );


        if (!exists) {

            return candidate;

        }


        number++;

    }

}


/* =========================================================
   カテゴリー変更
========================================================= */

function handleCategoryChange() {

    if (
        !isCreatingNewRecipe
    ) {

        return;

    }


    const currentId =
        recipeIdInput.value
            .trim();


    const pattern =
        /^(weapon|handicraft|special|food)-\d{3}$/;


    if (
        currentId === "" ||
        pattern.test(
            currentId
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


    const nameInput =
        fragment.querySelector(
            ".material-name-input"
        );


    const amountInput =
        fragment.querySelector(
            ".material-amount-input"
        );


    nameInput.value =
        material.name ||
        "";


    amountInput.value =
        Number.isFinite(
            Number(
                material.amount
            )
        )
            ? Number(
                material.amount
            )
            : 1;


    fragment
        .querySelector(
            ".remove-material-button"
        )
        .addEventListener(
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


    const locationNameInput =
        fragment.querySelector(
            ".location-name-input"
        );


    const addressInput =
        fragment.querySelector(
            ".location-address-input"
        );


    const fieldImageInput =
        fragment.querySelector(
            ".location-field-image-input"
        );


    const fieldImageFile =
        fragment.querySelector(
            ".location-field-image-file"
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


    const mapImageInput =
        fragment.querySelector(
            ".location-map-image-input"
        );


    const mapImageFile =
        fragment.querySelector(
            ".location-map-image-file"
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


    const removeLocationButton =
        fragment.querySelector(
            ".remove-location-button"
        );


    /* =========================
       初期値
    ========================= */

    locationNameInput.value =
        location.name ||
        "";


    addressInput.value =
        location.address ||
        "";


    fieldImageInput.value =
        location.fieldImage ||
        "";


    mapImageInput.value =
        location.mapImage ||
        "";


    descriptionInput.value =
        location.description ||
        "";


    if (
        location.fieldImage
    ) {

        fieldPreview.src =
            location.fieldImage;


        fieldPreviewWrap
            .classList
            .remove("hidden");

    } else {

        fieldPreview.src =
            "";


        fieldPreviewWrap
            .classList
            .add("hidden");

    }


    if (
        location.mapImage
    ) {

        mapPreview.src =
            location.mapImage;


        mapPreviewWrap
            .classList
            .remove("hidden");

    } else {

        mapPreview.src =
            "";


        mapPreviewWrap
            .classList
            .add("hidden");

    }


    /* =========================
       現地画像
    ========================= */

    fieldImageFile.addEventListener(
        "change",
        async () => {

            const file =
                fieldImageFile.files[0];


            if (!file) {

                return;

            }


            try {

                const dataURL =
                    await fileToDataURL(
                        file
                    );


                fieldImageInput.value =
                    dataURL;


                fieldPreview.src =
                    dataURL;


                fieldPreviewWrap
                    .classList
                    .remove("hidden");


                showToast(
                    "現地画像を読み込みました。",
                    "success"
                );

            } catch (error) {

                console.error(error);


                fieldImageFile.value =
                    "";


                showToast(
                    error.message ||
                    "画像の読み込みに失敗しました。",
                    "error"
                );

            }

        }
    );


    removeFieldButton.addEventListener(
        "click",
        () => {

            fieldImageInput.value =
                "";


            fieldImageFile.value =
                "";


            fieldPreview.src =
                "";


            fieldPreviewWrap
                .classList
                .add("hidden");

        }
    );


    /* =========================
       マップ画像
    ========================= */

    mapImageFile.addEventListener(
        "change",
        async () => {

            const file =
                mapImageFile.files[0];


            if (!file) {

                return;

            }


            try {

                const dataURL =
                    await fileToDataURL(
                        file
                    );


                mapImageInput.value =
                    dataURL;


                mapPreview.src =
                    dataURL;


                mapPreviewWrap
                    .classList
                    .remove("hidden");


                showToast(
                    "マップ画像を読み込みました。",
                    "success"
                );

            } catch (error) {

                console.error(error);


                mapImageFile.value =
                    "";


                showToast(
                    error.message ||
                    "画像の読み込みに失敗しました。",
                    "error"
                );

            }

        }
    );


    removeMapButton.addEventListener(
        "click",
        () => {

            mapImageInput.value =
                "";


            mapImageFile.value =
                "";


            mapPreview.src =
                "";


            mapPreviewWrap
                .classList
                .add("hidden");

        }
    );


    /* =========================
       場所削除
    ========================= */

    removeLocationButton.addEventListener(
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
   空表示
========================================================= */

function updateDynamicEmptyStates() {

    materialsEmpty
        .classList
        .toggle(
            "hidden",
            materialsEditor.children.length >
            0
        );


    locationsEmpty
        .classList
        .toggle(
            "hidden",
            locationsEditor.children.length >
            0
        );

}


/* =========================================================
   素材取得
========================================================= */

function collectMaterials() {

    return Array.from(
        materialsEditor.querySelectorAll(
            ".material-editor-item"
        )
    )
        .map(
            item => {

                const name =
                    item.querySelector(
                        ".material-name-input"
                    ).value.trim();


                let amount =
                    Number(
                        item.querySelector(
                            ".material-amount-input"
                        ).value
                    );


                if (
                    !Number.isFinite(
                        amount
                    ) ||
                    amount < 0
                ) {

                    amount =
                        0;

                }


                return {
                    name,
                    amount
                };

            }
        )
        .filter(
            material =>
                material.name !== ""
        );

}


/* =========================================================
   場所取得
========================================================= */

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


/* =========================================================
   フォーム取得
========================================================= */

function collectRecipeFromForm() {

    const existingRecipe =
        recipes.find(
            recipe =>
                recipe.id ===
                selectedRecipeId
        );


    const category =
        recipeCategoryInput.value;


    let sortOrder;


    /*
      新規作成
    */

    if (
        isCreatingNewRecipe
    ) {

        sortOrder =
            getNextSortOrder(
                category
            );

    }

    /*
      同カテゴリーで編集
    */

    else if (
        existingRecipe &&
        existingRecipe.category ===
        category
    ) {

        sortOrder =
            Number(
                existingRecipe.sortOrder
            ) || 1;

    }

    /*
      カテゴリー変更
      → 新カテゴリーの最後へ
    */

    else {

        sortOrder =
            getNextSortOrder(
                category
            );

    }


    return {

        id:
            recipeIdInput.value
                .trim(),

        category:
            category,

        name:
            recipeNameInput.value
                .trim(),

        sortOrder:
            sortOrder,

        description:
            recipeDescriptionInput.value
                .trim(),

        image:
            recipeImageInput.value,

        materials:
            collectMaterials(),

        locations:
            collectLocations(),

        notes:
            recipeNotesInput.value
                .trim()

    };

}


/* =========================================================
   保存
========================================================= */

function handleSave(event) {

    event.preventDefault();


    const oldRecipe =
        selectedRecipeId
            ? recipes.find(
                item =>
                    item.id ===
                    selectedRecipeId
            )
            : null;


    const oldCategory =
        oldRecipe
            ? oldRecipe.category
            : null;


    const recipe =
        collectRecipeFromForm();


    /* ID */

    if (
        recipe.id === ""
    ) {

        showToast(
            "レシピIDを入力してください。",
            "error"
        );


        recipeIdInput.focus();

        return;

    }


    /* 名前 */

    if (
        recipe.name === ""
    ) {

        showToast(
            "クラフト名を入力してください。",
            "error"
        );


        recipeNameInput.focus();

        return;

    }


    /* ID重複 */

    const duplicate =
        recipes.some(
            item => {

                if (
                    !isCreatingNewRecipe &&
                    item.id ===
                    selectedRecipeId
                ) {

                    return false;

                }


                return (
                    item.id ===
                    recipe.id
                );

            }
        );


    if (
        duplicate
    ) {

        showToast(
            "同じレシピIDが既に存在します。",
            "error"
        );


        recipeIdInput.focus();

        return;

    }


    createAutomaticBackup();


    /* =========================
       新規
    ========================= */

    if (
        isCreatingNewRecipe
    ) {

        recipes.push(
            recipe
        );


        isCreatingNewRecipe =
            false;

    }

    /* =========================
       編集
    ========================= */

    else {

        const index =
            recipes.findIndex(
                item =>
                    item.id ===
                    selectedRecipeId
            );


        if (
            index === -1
        ) {

            showToast(
                "編集対象が見つかりません。",
                "error"
            );


            return;

        }


        recipes[index] =
            recipe;

    }


    selectedRecipeId =
        recipe.id;


    /*
      カテゴリー変更された場合は
      元カテゴリーと新カテゴリーの番号を整理
    */

    if (
        oldCategory &&
        oldCategory !==
        recipe.category
    ) {

        renumberCategory(
            oldCategory
        );

    }


    renumberCategory(
        recipe.category
    );


    if (
        !persistRecipes()
    ) {

        return;

    }


    reloadAdminData();


    const savedRecipe =
        recipes.find(
            item =>
                item.id ===
                selectedRecipeId
        );


    if (
        savedRecipe
    ) {

        fillEditor(
            savedRecipe
        );

    }


    renderRecipeList();


    showToast(
        "レシピを保存しました。",
        "success"
    );

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


    if (
        !selectedRecipeId
    ) {

        return;

    }


    deleteConfirmModal
        .classList
        .add("active");


    deleteConfirmModal
        .setAttribute(
            "aria-hidden",
            "false"
        );

}


function closeDeleteModal() {

    deleteConfirmModal
        .classList
        .remove("active");


    deleteConfirmModal
        .setAttribute(
            "aria-hidden",
            "true"
        );

}


function deleteSelectedRecipe() {

    const index =
        recipes.findIndex(
            recipe =>
                recipe.id ===
                selectedRecipeId
        );


    if (
        index === -1
    ) {

        closeDeleteModal();

        return;

    }


    const category =
        recipes[
            index
        ].category;


    createAutomaticBackup();


    recipes.splice(
        index,
        1
    );


    renumberCategory(
        category
    );


    if (
        !persistRecipes()
    ) {

        return;

    }


    reloadAdminData();


    closeDeleteModal();

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


    exportModal
        .classList
        .add("active");


    exportModal
        .setAttribute(
            "aria-hidden",
            "false"
        );

}


function closeExportModal() {

    exportModal
        .classList
        .remove("active");


    exportModal
        .setAttribute(
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
            "データをコピーしました。",
            "success"
        );

    } catch (error) {

        exportTextarea.select();


        const success =
            document.execCommand(
                "copy"
            );


        showToast(
            success
                ? "データをコピーしました。"
                : "コピーに失敗しました。",
            success
                ? "success"
                : "error"
        );

    }

}


function downloadExportData() {

    const blob =
        new Blob(
            [
                JSON.stringify(
                    recipes,
                    null,
                    2
                )
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


    document.body.appendChild(
        link
    );


    link.click();


    link.remove();


    URL.revokeObjectURL(
        url
    );


    showToast(
        "JSONファイルを保存しました。",
        "success"
    );

}


/* =========================================================
   JSON読み込み
========================================================= */

function openImportModal() {

    importTextarea.value =
        "";


    importFileInput.value =
        "";


    importModal
        .classList
        .add("active");


    importModal
        .setAttribute(
            "aria-hidden",
            "false"
        );

}


function closeImportModal() {

    importModal
        .classList
        .remove("active");


    importModal
        .setAttribute(
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


    try {

        importTextarea.value =
            await file.text();

    } catch (error) {

        console.error(error);


        showToast(
            "ファイルの読み込みに失敗しました。",
            "error"
        );

    }

}


function executeImport() {

    const text =
        importTextarea.value
            .trim();


    if (
        text === ""
    ) {

        showToast(
            "JSONデータを入力してください。",
            "error"
        );


        return;

    }


    if (
        typeof importCraftRecipesJSON !==
        "function"
    ) {

        showToast(
            "JSON読込機能が利用できません。",
            "error"
        );


        return;

    }


    createAutomaticBackup();


    const result =
        importCraftRecipesJSON(
            text
        );


    if (
        !result.success
    ) {

        showToast(
            result.message,
            "error"
        );


        return;

    }


    reloadAdminData();


    closeImportModal();

    closeEditor();

    renderRecipeList();


    showToast(
        "JSONデータを読み込みました。",
        "success"
    );

}


/* =========================================================
   初期化
========================================================= */

function openResetModal() {

    resetConfirmModal
        .classList
        .add("active");


    resetConfirmModal
        .setAttribute(
            "aria-hidden",
            "false"
        );

}


function closeResetModal() {

    resetConfirmModal
        .classList
        .remove("active");


    resetConfirmModal
        .setAttribute(
            "aria-hidden",
            "true"
        );

}


function executeReset() {

    if (
        typeof resetCraftRecipes !==
        "function"
    ) {

        showToast(
            "初期化機能が利用できません。",
            "error"
        );


        return;

    }


    createAutomaticBackup();


    const resetData =
        resetCraftRecipes();


    if (
        !resetData
    ) {

        showToast(
            "初期化に失敗しました。",
            "error"
        );


        return;

    }


    recipes =
        resetData;


    closeResetModal();

    closeEditor();

    renderRecipeList();


    showToast(
        "初期データへ戻しました。",
        "success"
    );

}


/* =========================================================
   バックアップ
========================================================= */

function openBackupModal() {

    const backup =
        loadBackup();


    if (
        !backup
    ) {

        backupDescription.textContent =
            "現在、復元できるバックアップはありません。";


        restoreBackupButton.disabled =
            true;

    } else {

        const date =
            new Date(
                backup.savedAt
            );


        backupDescription.textContent =
            `バックアップ日時：${date.toLocaleString("ja-JP")}
この状態へ復元できます。`;


        restoreBackupButton.disabled =
            false;

    }


    backupModal
        .classList
        .add("active");


    backupModal
        .setAttribute(
            "aria-hidden",
            "false"
        );

}


function closeBackupModal() {

    backupModal
        .classList
        .remove("active");


    backupModal
        .setAttribute(
            "aria-hidden",
            "true"
        );

}


function restoreBackup() {

    const backup =
        loadBackup();


    if (
        !backup
    ) {

        showToast(
            "復元できるバックアップがありません。",
            "error"
        );


        return;

    }


    if (
        typeof saveCraftRecipes !==
        "function"
    ) {

        showToast(
            "データ保存機能が利用できません。",
            "error"
        );


        return;

    }


    const success =
        saveCraftRecipes(
            backup.recipes
        );


    if (
        !success
    ) {

        showToast(
            "バックアップの復元に失敗しました。",
            "error"
        );


        return;

    }


    reloadAdminData();


    closeBackupModal();

    closeEditor();

    renderRecipeList();


    showToast(
        "バックアップを復元しました。",
        "success"
    );

}


/* =========================================================
   外部タブ等でデータ更新された場合
========================================================= */

function handleCraftDataUpdated() {

    const currentId =
        selectedRecipeId;


    reloadAdminData();


    renderRecipeList();


    if (
        !currentId ||
        isCreatingNewRecipe
    ) {

        return;

    }


    const updatedRecipe =
        recipes.find(
            recipe =>
                recipe.id ===
                currentId
        );


    if (
        updatedRecipe
    ) {

        fillEditor(
            updatedRecipe
        );

    } else {

        closeEditor();

    }

}


/* =========================================================
   通知
========================================================= */

function showToast(
    message,
    type = ""
) {

    if (
        toastTimer
    ) {

        clearTimeout(
            toastTimer
        );

    }


    toast.textContent =
        message;


    toast.className =
        "toast show";


    if (
        type
    ) {

        toast.classList.add(
            type
        );

    }


    toastTimer =
        setTimeout(
            () => {

                toast
                    .classList
                    .remove("show");

            },
            2500
        );

}


/* =========================================================
   イベント
========================================================= */

/* 新規 */

addRecipeButton.addEventListener(
    "click",
    createNewRecipe
);


emptyAddRecipeButton.addEventListener(
    "click",
    createNewRecipe
);


/* 検索 */

adminSearchInput.addEventListener(
    "input",
    renderRecipeList
);


/* カテゴリー絞り込み */

adminCategoryFilter.addEventListener(
    "change",
    renderRecipeList
);


/* 編集カテゴリー */

recipeCategoryInput.addEventListener(
    "change",
    handleCategoryChange
);


/* レシピ画像 */

recipeImageFile.addEventListener(
    "change",
    handleRecipeImageFile
);


removeRecipeImageButton.addEventListener(
    "click",
    removeRecipeImage
);


/* 素材 */

addMaterialButton.addEventListener(
    "click",
    () => {

        addMaterialEditor();

    }
);


/* 場所 */

addLocationButton.addEventListener(
    "click",
    () => {

        addLocationEditor();

    }
);


/* 保存 */

recipeEditorForm.addEventListener(
    "submit",
    handleSave
);


/* キャンセル */

cancelEditButton.addEventListener(
    "click",
    closeEditor
);


/* 削除 */

deleteRecipeButton.addEventListener(
    "click",
    openDeleteModal
);


confirmDeleteButton.addEventListener(
    "click",
    deleteSelectedRecipe
);


/* JSON読込 */

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


/* JSON書き出し */

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


/* 初期化 */

resetButton.addEventListener(
    "click",
    openResetModal
);


confirmResetButton.addEventListener(
    "click",
    executeReset
);


/* バックアップ */

backupButton.addEventListener(
    "click",
    openBackupModal
);


restoreBackupButton.addEventListener(
    "click",
    restoreBackup
);


/* =========================================================
   モーダルを閉じる
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


        if (
            deleteConfirmModal
                .classList
                .contains("active")
        ) {

            closeDeleteModal();

            return;

        }


        if (
            exportModal
                .classList
                .contains("active")
        ) {

            closeExportModal();

            return;

        }


        if (
            importModal
                .classList
                .contains("active")
        ) {

            closeImportModal();

            return;

        }


        if (
            resetConfirmModal
                .classList
                .contains("active")
        ) {

            closeResetModal();

            return;

        }


        if (
            backupModal
                .classList
                .contains("active")
        ) {

            closeBackupModal();

        }

    }
);


/* =========================================================
   data.js データ更新イベント
========================================================= */

window.addEventListener(
    "craftDataUpdated",
    handleCraftDataUpdated
);


/* =========================================================
   初期化
========================================================= */

function initializeAdmin() {

    const loaded =
        reloadAdminData();


    if (
        !loaded
    ) {

        return;

    }


    /*
      既存データのカテゴリー内順番を整理
    */

    Object.keys(
        categoryLabels
    ).forEach(
        category => {

            renumberCategory(
                category
            );

        }
    );


    /*
      sortOrder追加後のデータを
      localStorageへ一度保存
    */

    persistRecipes();


    renderRecipeList();


    updateDynamicEmptyStates();


    hideRecipeImagePreview();

}


document.addEventListener(
    "DOMContentLoaded",
    initializeAdmin
);
