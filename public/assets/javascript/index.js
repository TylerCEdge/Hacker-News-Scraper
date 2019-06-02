/* global bootbox */
$(document).ready(function() {
  var articleContainer = $(".article-container");
  $(document).on("click", ".btn.save", handleArticleSave);
  $(document).on("click", ".scrape-new", handleArticleScrape);

  initPage();

  function initPage() {
    $.get("/api/headlines?saved=false").then(function(data) {
      articleContainer.empty();

      if (data && data.length) {
        renderArticles(data);
      } else {
        renderEmpty();
      }
    });
  }

  function renderArticles(articles) {
    var articleCards = [];

    for (var i = 0; i < articles.length; i++) {
      articleCards.push(createCard(articles[i]));
    }
    articleContainer.append(articleCards);
  }

  function createCard(article) {
    // This function takes in a single JSON object for an article/headline
    // It constructs a jQuery element containing all of the formatted HTML for the
    // article card
    var card = $("<div class='card'>");
    var cardHeader = $("<div class='card-header'>").append(
      $("<h3>").append(
        $("<a class='article-link' target='_blank' rel='noopener noreferrer'>")
          .attr("href", article.url)
          .text(article.headline),
        $("<a class='btn btn-success save'>Save Article</a>")
      )
    );

    var cardBody = $("<div class='card-body'>").text(article.summary);

    card.append(cardHeader, cardBody);
    // We attach the article's id to the jQuery element
    // We will use this when trying to figure out which article the user wants to save
    card.data("_id", article._id);
    // We return the constructed card jQuery element
    return card;
  }

  // function createCard(article) {
  //     // This function takes in a single JSON object for an article/headline
  //     // It constructs a jQuery element containing all of the formatted HTML for the
  //     // article card
  //     var card = $("<div class='card'>");
  //     var cardHeader = $("<div class='card-header'>").append(
  //         $("<h3>").append(
  //             $("<a class='article-link' target='_blank' rel='noopener noreferrer'>")
  //                 .attr("href", article.url)
  //                 .text(article.headline),
  //             $("<a class='btn btn-danger delete'>Delete From Saved</a>"),
  //             $("<a class='btn btn-info notes'>Article Notes</a>")
  //         )
  //     );

  //     var cardBody = $("<div class='card-body'>").text(article.summary);

  //     card.append(cardHeader, cardBody);

  //     // We attach the article's id to the jQuery element
  //     // We will use this when trying to figure out which article the user wants to remove or open notes for
  //     card.data("_id", article._id);
  //     // We return the constructed card jQuery element
  //     return card;
  // }

  function renderEmpty() {
    var emptyAlert = $(
      [
        "<div class='alert alert-warning text-center'>",
        "<h4>Uh Oh, Looks like we don't have any new articles.</h4>",
        "</div>",
        "<div class='card'>",
        "<div class='card-header text-center'>",
        "<h3>What Would You Like To Do?</h3>",
        "</div>",
        "<div class='card-body text-center'>",
        "<h4><a class='scrape-new'>Try Scraping New Articles</a></h4>",
        "<h4><a href='/saved'>Go To Saved Articles</a></h4>",
        "</div>",
        "</div>"
      ].join("")
    );
    articleContainer.append(emptyAlert);
  }

  function handleArticleSave() {
    var articleToSave = $(this)
      .parents(".card")
      .data();

    $(this)
      .parents("card")
      .remove();

    articleToSave.saved = true;
    console.log(articleToSave);

    $.ajax({
      method: "PATCH",
      url: "/api/headlines",
      data: articleToSave
    }).then(function(data) {
      if (data.ok) {
        initPage();
      }
    });
  }

  function handleArticleScrape() {
    $.get("/api/fetch").then(function(data) {
      initPage();
      bootbox.alert(
        "<h3 class='text-center m-top-80'>" + data.message + "<h3>"
      );
    });
  }
});

// 62-86

// function createCard(article) {

//     var card =
//         $(["<div class='card'>",
//             "<div class='card-header text-center'>",
//             "<h3>",
//             article.headline,
//             "<a class='btn btn-success btn-save'>",
//             "save Article",
//             "</a>",
//             "</h3>",
//             "</div>",
//             "<div class='card-body text-center'>",
//             article.summary,
//             "</div>",
//             "</div>"
//         ].join(""));

//     card.data("_id", article._id);

//     return card;
// }
