/* =========================================================
   Craft Recipe Database
   Frontend
   script.js
========================================================= */


/* =========================================================
   カテゴリー設定
========================================================= */

const categoryData = {

    all: {
        name: "すべてのクラフト",
        description:
            "登録されているクラフトレシピから必要な素材数を確認できます。",
        label: "すべて"
    },

    weapon: {
        name: "武器クラフト",
        description:
            "武器クラフトのレシピ・必要素材・クラフト場所を確認できます。",
        label: "武器"
    },

    handicraft: {
        name: "手芸クラフト",
        description:
            "衣服やバッグなどの手芸クラフトを確認できます。",
        label: "手芸"
    },

    special: {
        name: "特殊クラフト",
        description:
            "特殊アイテムのレシピやクラフト場所を確認できます。",
        label: "特殊"
    },

    food: {
        name: "飲食クラフト",
        description:
            "飲食物のレシピや必要素材を確認できます。",
        label: "飲食"
    }

};


/* =========================================================
   DOM
========================================================= */

const recipeGrid =
    document.getElementById("recipeGrid");

const recipeCount =
    document.getElementById("recipeCount");

const searchInput =
    document.getElementById("searchInput");

const categorySelect =
    document.getElementById("categorySelect");

const sortSelect =
    document.getElementById("sortSelect");

const categoryTitle =
    document.getElementById("categoryTitle");

const categoryDescription =
    document.getElementById("categoryDescription");

const emptyState =
    document.getElementById("emptyState");

const navItems =
    document.querySelectorAll(".nav-item");


/* レシピ詳細モーダル */

const recipeModal =
    document.getElementById("recipeModal");

const modalCategory =
    document.getElementById("modalCategory");

const modalRecipeName =
    document.getElementById("modalRecipeName");

const craftQuantity =
    document.getElementById("craftQuantity");

const quantityMinus =
    document.getElementById("quantityMinus");

const quantityPlus =
    document.getElementById("quantityPlus");

const materialList =
    document.getElementById("materialList");

const locationList =
    document.getElementById("locationList");

const modalNotes =
    document.getElementById("modalNotes");

const notesSection =
    document.getElementById("notesSection");


/* 画像拡大モーダル */

const imageModal =
    document.getElementById("imageModal");

const enlargedImage =
    document.getElementById("enlargedImage");

const enlargedImageCaption =
    document.getElementById("enlargedImageCaption");


/* スマホメニュー */

const menuButton =
    document.getElementById("menuButton");

const sidebar =
    document.getElementById("sidebar");

const sidebarOverlay =
    document.getElementById("sidebarOverlay");


/* =========================================================
   状態
========================================================= */

let recipes = [];

let currentCategory =
    "all";

let currentRecipe =
    null;

let currentQuantity =
    1;


/* =========================================================
   HTMLエスケープ
========================================================= */

function escapeHTML(value) {

    return String(
        value ?? ""
    )
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


/* =========================================================
   共通データ読み込み
========================================================= */

function reloadRecipeData() {

    if (
        typeof loadCraftRecipes !==
        "function"
    ) {

        console.error(
            "data.js が読み込まれていません。"
        );

        recipes = [];

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
   カテゴリー情報取得
========================================================= */

function getCategoryInfo(
    category
) {

    return (
        categoryData[
        category
        ] || {
            name: "その他",
            description: "",
            label: "その他"
        }
    );

}


/* =========================================================
   検索文字列
========================================================= */

function createSearchText(
    recipe
) {

    const materials =
        Array.isArray(
            recipe.materials
        )
            ? recipe.materials
            : [];


    const locations =
        Array.isArray(
            recipe.locations
        )
            ? recipe.locations
            : [];


    const materialText =
        materials
            .map(
                material => `
          ${material.name || ""}
          ${material.amount ?? ""}
        `
            )
            .join(" ");


    const locationText =
        locations
            .map(
                location => `
          ${location.name || ""}
          ${location.address || ""}
          ${location.description || ""}
        `
            )
            .join(" ");


    return `
    ${recipe.id || ""}
    ${recipe.name || ""}
    ${recipe.description || ""}
    ${recipe.notes || ""}
    ${materialText}
    ${locationText}
  `.toLowerCase();

}


/* =========================================================
   絞り込み・並び替え
========================================================= */

function getFilteredRecipes() {

    const keyword =
        searchInput.value
            .trim()
            .toLowerCase();


    const filtered =
        recipes.filter(
            recipe => {

                const categoryMatch =
                    currentCategory ===
                    "all" ||
                    recipe.category ===
                    currentCategory;


                const keywordMatch =
                    keyword === "" ||
                    createSearchText(
                        recipe
                    ).includes(
                        keyword
                    );


                return (
                    categoryMatch &&
                    keywordMatch
                );

            }
        );


    const result =
        [...filtered];


    switch (
    sortSelect.value
    ) {

        case "nameAsc":

            result.sort(
                (a, b) =>
                    String(
                        a.name || ""
                    ).localeCompare(
                        String(
                            b.name || ""
                        ),
                        "ja"
                    )
            );

            break;


        case "nameDesc":

            result.sort(
                (a, b) =>
                    String(
                        b.name || ""
                    ).localeCompare(
                        String(
                            a.name || ""
                        ),
                        "ja"
                    )
            );

            break;

    }


    return result;

}


/* =========================================================
   一覧描画
========================================================= */

function renderRecipes() {

    const filteredRecipes =
        getFilteredRecipes();


    recipeGrid.innerHTML =
        "";


    recipeCount.textContent =
        filteredRecipes.length;


    if (
        filteredRecipes.length ===
        0
    ) {

        recipeGrid.classList.add(
            "hidden"
        );

        emptyState.classList.remove(
            "hidden"
        );

        return;

    }


    recipeGrid.classList.remove(
        "hidden"
    );

    emptyState.classList.add(
        "hidden"
    );


    filteredRecipes.forEach(
        recipe => {

            recipeGrid.appendChild(
                createRecipeCard(
                    recipe
                )
            );

        }
    );

}


/* =========================================================
   レシピカード
========================================================= */

function createRecipeCard(
    recipe
) {

    const categoryInfo =
        getCategoryInfo(
            recipe.category
        );


    const materials =
        Array.isArray(
            recipe.materials
        )
            ? recipe.materials
            : [];


    const locations =
        Array.isArray(
            recipe.locations
        )
            ? recipe.locations
            : [];


    const article =
        document.createElement(
            "article"
        );


    article.className =
        "recipe-card";


    const imageHTML =
        recipe.image
            ? `
        <img
          class="recipe-image"
          src="${escapeHTML(recipe.image)}"
          alt="${escapeHTML(recipe.name)}"
          loading="lazy"
        >

        <div
          class="recipe-image-placeholder"
          hidden
        >
          ⚒️
        </div>
      `
            : `
        <div
          class="recipe-image-placeholder"
        >
          ⚒️
        </div>
      `;


    article.innerHTML = `

    <div class="recipe-image-wrap">

      ${imageHTML}

    </div>


    <div class="recipe-card-body">

      <div class="recipe-card-top">

        <h3>
          ${escapeHTML(
        recipe.name ||
        "名称未設定"
    )}
        </h3>


        <span
          class="
            category-badge
            ${escapeHTML(
        recipe.category
    )}
          "
        >
          ${escapeHTML(
        categoryInfo.label
    )}
        </span>

      </div>


      <p class="recipe-description">

        ${escapeHTML(
        recipe.description ||
        "説明は登録されていません。"
    )}

      </p>


      <div class="recipe-meta">

        <span class="meta-item">
          🧱
          ${materials.length}
          種類
        </span>

        <span class="meta-item">
          📍
          ${locations.length}
          箇所
        </span>

      </div>


      <button
        type="button"
        class="recipe-detail-button"
        data-recipe-id="${escapeHTML(recipe.id)}"
      >
        詳細・素材計算を見る
      </button>

    </div>

  `;


    /* 画像エラー時 */

    const recipeImage =
        article.querySelector(
            ".recipe-image"
        );


    if (
        recipeImage
    ) {

        recipeImage.addEventListener(
            "error",
            () => {

                recipeImage.hidden =
                    true;


                const placeholder =
                    article.querySelector(
                        ".recipe-image-placeholder"
                    );


                if (
                    placeholder
                ) {

                    placeholder.hidden =
                        false;

                }

            }
        );

    }


    /* 詳細 */

    const detailButton =
        article.querySelector(
            ".recipe-detail-button"
        );


    detailButton.addEventListener(
        "click",
        () => {

            openRecipeModal(
                recipe.id
            );

        }
    );


    return article;

}


/* =========================================================
   カテゴリー変更
========================================================= */

function changeCategory(
    category
) {

    if (
        !categoryData[
        category
        ]
    ) {

        category =
            "all";

    }


    currentCategory =
        category;


    categoryTitle.textContent =
        categoryData[
            category
        ].name;


    categoryDescription.textContent =
        categoryData[
            category
        ].description;


    categorySelect.value =
        category;


    navItems.forEach(
        item => {

            item.classList.toggle(
                "active",
                item.dataset.category ===
                category
            );

        }
    );


    renderRecipes();

}


/* =========================================================
   詳細モーダル
========================================================= */

function openRecipeModal(
    recipeId
) {

    const recipe =
        recipes.find(
            item =>
                item.id ===
                recipeId
        );


    if (
        !recipe
    ) {

        return;

    }


    currentRecipe =
        recipe;


    currentQuantity =
        1;


    craftQuantity.value =
        1;


    updateRecipeModalHeader();

    renderMaterials();

    renderLocations();

    renderNotes();


    recipeModal.classList.add(
        "active"
    );


    recipeModal.setAttribute(
        "aria-hidden",
        "false"
    );


    document.body.style.overflow =
        "hidden";

}


/* =========================================================
   詳細モーダルヘッダー
========================================================= */

function updateRecipeModalHeader() {

    if (
        !currentRecipe
    ) {

        return;

    }


    const categoryInfo =
        getCategoryInfo(
            currentRecipe.category
        );


    modalCategory.className =
        `category-badge ${currentRecipe.category}`;


    modalCategory.textContent =
        categoryInfo.label;


    modalRecipeName.textContent =
        currentRecipe.name ||
        "名称未設定";

}


/* =========================================================
   モーダル閉じる
========================================================= */

function closeRecipeModal() {

    recipeModal.classList.remove(
        "active"
    );


    recipeModal.setAttribute(
        "aria-hidden",
        "true"
    );


    currentRecipe =
        null;


    currentQuantity =
        1;


    document.body.style.overflow =
        "";

}


/* =========================================================
   素材
========================================================= */

function renderMaterials() {

    if (
        !currentRecipe
    ) {

        return;

    }


    const materials =
        Array.isArray(
            currentRecipe.materials
        )
            ? currentRecipe.materials
            : [];


    materialList.innerHTML =
        "";


    if (
        materials.length ===
        0
    ) {

        const row =
            document.createElement(
                "tr"
            );


        row.innerHTML = `

      <td colspan="3">
        必要素材は登録されていません。
      </td>

    `;


        materialList.appendChild(
            row
        );

        return;

    }


    materials.forEach(
        material => {

            const amount =
                Number(
                    material.amount
                ) || 0;


            const total =
                amount *
                currentQuantity;


            const row =
                document.createElement(
                    "tr"
                );


            row.innerHTML = `

        <td class="material-name">

          ${escapeHTML(
                material.name ||
                "名称未設定"
            )}

        </td>


        <td>

          ${formatNumber(
                amount
            )}

        </td>


        <td class="material-total">

          ${formatNumber(
                total
            )}

        </td>

      `;


            materialList.appendChild(
                row
            );

        }
    );

}


/* =========================================================
   数値表示
========================================================= */

function formatNumber(
    number
) {

    return new Intl.NumberFormat(
        "ja-JP"
    ).format(
        number
    );

}


/* =========================================================
   作成数
========================================================= */

function updateQuantity(
    value
) {

    let quantity =
        Number(
            value
        );


    if (
        !Number.isFinite(
            quantity
        ) ||
        quantity < 1
    ) {

        quantity =
            1;

    }


    quantity =
        Math.floor(
            quantity
        );


    currentQuantity =
        quantity;


    craftQuantity.value =
        quantity;


    renderMaterials();

}


/* =========================================================
   クラフト場所
========================================================= */

function renderLocations() {

    if (
        !currentRecipe
    ) {

        return;

    }


    const locations =
        Array.isArray(
            currentRecipe.locations
        )
            ? currentRecipe.locations
            : [];


    locationList.innerHTML =
        "";


    if (
        locations.length ===
        0
    ) {

        const card =
            document.createElement(
                "article"
            );


        card.className =
            "location-card";


        card.innerHTML = `

      <div class="location-header">

        <h4>
          クラフト場所未登録
        </h4>

        <span class="location-address">
          📍 場所情報はありません
        </span>

      </div>

    `;


        locationList.appendChild(
            card
        );

        return;

    }


    locations.forEach(
        location => {

            const card =
                document.createElement(
                    "article"
                );


            card.className =
                "location-card";


            card.innerHTML = `

        <div class="location-header">

          <h4>

            ${escapeHTML(
                location.name ||
                "名称未設定"
            )}

          </h4>


          <span class="location-address">

            📍

            ${escapeHTML(
                location.address ||
                "番地未登録"
            )}

          </span>

        </div>


        <div class="location-images">

          ${createLocationImageHTML(
                location.fieldImage,
                "現地写真",
                location.name
            )}


          ${createLocationImageHTML(
                location.mapImage,
                "マップ",
                location.name
            )}

        </div>


        ${location.description
                    ? `
              <p class="location-description">

                ${escapeHTML(
                        location.description
                    )}

              </p>
            `
                    : ""
                }

      `;


            /* 画像クリック */

            card
                .querySelectorAll(
                    ".location-image-button"
                )
                .forEach(
                    button => {

                        button.addEventListener(
                            "click",
                            () => {

                                openImageModal(
                                    button.dataset.image,
                                    button.dataset.caption
                                );

                            }
                        );

                    }
                );


            /* 画像エラー */

            card
                .querySelectorAll(
                    ".location-image-button img"
                )
                .forEach(
                    image => {

                        image.addEventListener(
                            "error",
                            () => {

                                const button =
                                    image.closest(
                                        ".location-image-button"
                                    );


                                if (
                                    !button
                                ) {

                                    return;

                                }


                                button.disabled =
                                    true;


                                button.innerHTML = `

                  <span class="location-placeholder">
                    画像未登録
                  </span>

                `;

                            }
                        );

                    }
                );


            locationList.appendChild(
                card
            );

        }
    );

}


/* =========================================================
   場所画像HTML
========================================================= */

function createLocationImageHTML(
    image,
    label,
    locationName
) {

    if (
        !image
    ) {

        return `

      <div class="location-placeholder">

        ${escapeHTML(label)}
        未登録

      </div>

    `;

    }


    const caption =
        `${locationName ||
        "クラフト場所"
        } - ${label}`;


    return `

    <button
      type="button"
      class="location-image-button"
      data-image="${escapeHTML(image)}"
      data-caption="${escapeHTML(caption)}"
      aria-label="${escapeHTML(caption)}を拡大"
    >

      <img
        src="${escapeHTML(image)}"
        alt="${escapeHTML(caption)}"
        loading="lazy"
      >


      <span class="location-image-label">
        ${escapeHTML(label)}
      </span>

    </button>

  `;

}


/* =========================================================
   備考
========================================================= */

function renderNotes() {

    if (
        !currentRecipe
    ) {

        return;

    }


    const notes =
        String(
            currentRecipe.notes ||
            ""
        ).trim();


    if (
        notes === ""
    ) {

        notesSection.classList.add(
            "hidden"
        );


        modalNotes.textContent =
            "";


        return;

    }


    notesSection.classList.remove(
        "hidden"
    );


    modalNotes.textContent =
        notes;

}


/* =========================================================
   画像拡大
========================================================= */

function openImageModal(
    image,
    caption = ""
) {

    if (
        !image
    ) {

        return;

    }


    enlargedImage.src =
        image;


    enlargedImage.alt =
        caption;


    enlargedImageCaption.textContent =
        caption;


    imageModal.classList.add(
        "active"
    );


    imageModal.setAttribute(
        "aria-hidden",
        "false"
    );

}


/* =========================================================
   画像拡大を閉じる
========================================================= */

function closeImageModal() {

    imageModal.classList.remove(
        "active"
    );


    imageModal.setAttribute(
        "aria-hidden",
        "true"
    );


    enlargedImage.src =
        "";


    enlargedImage.alt =
        "";


    enlargedImageCaption.textContent =
        "";

}


/* =========================================================
   スマホメニュー
========================================================= */

function openSidebar() {

    sidebar.classList.add(
        "open"
    );


    sidebarOverlay.classList.add(
        "active"
    );

}


function closeSidebar() {

    sidebar.classList.remove(
        "open"
    );


    sidebarOverlay.classList.remove(
        "active"
    );

}


function toggleSidebar() {

    if (
        sidebar.classList.contains(
            "open"
        )
    ) {

        closeSidebar();

    } else {

        openSidebar();

    }

}


/* =========================================================
   データ更新時
========================================================= */

function handleCraftDataUpdated() {

    const openedRecipeId =
        currentRecipe
            ? currentRecipe.id
            : null;


    reloadRecipeData();

    renderRecipes();


    if (
        !openedRecipeId ||
        !recipeModal.classList.contains(
            "active"
        )
    ) {

        return;

    }


    const updatedRecipe =
        recipes.find(
            recipe =>
                recipe.id ===
                openedRecipeId
        );


    if (
        !updatedRecipe
    ) {

        closeRecipeModal();

        return;

    }


    currentRecipe =
        updatedRecipe;


    updateRecipeModalHeader();

    renderMaterials();

    renderLocations();

    renderNotes();

}


/* =========================================================
   検索
========================================================= */

searchInput.addEventListener(
    "input",
    renderRecipes
);


/* =========================================================
   カテゴリーセレクト
========================================================= */

categorySelect.addEventListener(
    "change",
    event => {

        changeCategory(
            event.target.value
        );

    }
);


/* =========================================================
   並び替え
========================================================= */

sortSelect.addEventListener(
    "change",
    renderRecipes
);


/* =========================================================
   サイドナビ
========================================================= */

navItems.forEach(
    item => {

        item.addEventListener(
            "click",
            () => {

                changeCategory(
                    item.dataset.category
                );


                closeSidebar();

            }
        );

    }
);


/* =========================================================
   作成数
========================================================= */

quantityMinus.addEventListener(
    "click",
    () => {

        updateQuantity(
            currentQuantity - 1
        );

    }
);


quantityPlus.addEventListener(
    "click",
    () => {

        updateQuantity(
            currentQuantity + 1
        );

    }
);


craftQuantity.addEventListener(
    "input",
    event => {

        if (
            event.target.value ===
            ""
        ) {

            return;

        }


        updateQuantity(
            event.target.value
        );

    }
);


craftQuantity.addEventListener(
    "change",
    event => {

        updateQuantity(
            event.target.value
        );

    }
);


/* =========================================================
   詳細モーダルを閉じる
========================================================= */

document
    .querySelectorAll(
        "[data-close-modal]"
    )
    .forEach(
        element => {

            element.addEventListener(
                "click",
                closeRecipeModal
            );

        }
    );


/* =========================================================
   画像モーダルを閉じる
========================================================= */

document
    .querySelectorAll(
        "[data-close-image]"
    )
    .forEach(
        element => {

            element.addEventListener(
                "click",
                closeImageModal
            );

        }
    );


/* =========================================================
   スマホメニュー
========================================================= */

menuButton.addEventListener(
    "click",
    toggleSidebar
);


sidebarOverlay.addEventListener(
    "click",
    closeSidebar
);


/* =========================================================
   ESCキー
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
            imageModal.classList.contains(
                "active"
            )
        ) {

            closeImageModal();

            return;

        }


        if (
            recipeModal.classList.contains(
                "active"
            )
        ) {

            closeRecipeModal();

            return;

        }


        closeSidebar();

    }
);


/* =========================================================
   ウィンドウサイズ変更
========================================================= */

window.addEventListener(
    "resize",
    () => {

        if (
            window.innerWidth >
            760
        ) {

            closeSidebar();

        }

    }
);


/* =========================================================
   管理画面からの更新
========================================================= */

window.addEventListener(
    "craftDataUpdated",
    handleCraftDataUpdated
);


/* =========================================================
   初期化
========================================================= */

function initializeApp() {

    reloadRecipeData();

    changeCategory(
        "all"
    );

}


document.addEventListener(
    "DOMContentLoaded",
    initializeApp
);