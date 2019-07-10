function showSection(id) {
  document.getElementById(id).classList.remove("-hidden");
}

function feedback() {
  function feedbackTemplate(title, content, allPhotos, images) {
    return [
      '<div class="feedback__width-container"><div class="feedback__content">',
      '<h3 class="feedback__content-title">' + title + "</h3>",
      content
        .map(function(paragraph) {
          return "<p>" + paragraph + "</p>";
        })
        .join(""),
      '<a href="' + allPhotos + '" class="feedback__link">All photos ➝</a>',
      '<div class="feedback__nav">',
      '<a href="#" class="feedback_prev">←</a>',
      '<a href="#" class="feedback_next">→</a>',
      "</div></div>",
      '<div class="feedback__images"><div class="feedback__images-container">',
      '<img src="' + images[0] + '" alt="" class="feedback__images-img1" />',
      '<img src="' + images[1] + '" alt="" class="feedback__images-img2" />',
      "</div></div></div>"
    ].join("\n");
  }

  function loadFeedbackData() {
    return fetch("feedback.json").then(function(res) {
      return res.json();
    });
  }

  var feedbackElement = document.querySelector(".feedback");

  loadFeedbackData()
    .then(function(data) {
      showSection(feedbackElement.dataset.section);
      return data;
    })
    .then(function(data) {
      var currentFeedback = Math.floor(Math.random() * data.length);
      var feedbackData = data[currentFeedback];
      feedbackElement.innerHTML = feedbackTemplate(
        feedbackData.name,
        feedbackData.content,
        feedbackData.allPhotos,
        feedbackData.images
      );

      function renderFeedback(step) {
        feedbackElement.classList.add("-loading");

        setTimeout(function() {
          var nextStep = currentFeedback + step;
          currentFeedback =
            nextStep >= data.length
              ? 0
              : nextStep < 0
              ? data.length - 1
              : nextStep;

          var feedbackData = data[currentFeedback];
          feedbackElement.innerHTML = feedbackTemplate(
            feedbackData.name,
            feedbackData.content,
            feedbackData.allPhotos,
            feedbackData.images
          );

          setTimeout(function() {
            feedbackElement.classList.remove("-loading");
          }, 300);
        }, 300);
      }

      feedbackElement.addEventListener("click", function(evt) {
        if (evt.target.className === "feedback_next") {
          evt.preventDefault();
          renderFeedback(1);
        } else if (evt.target.className === "feedback_prev") {
          evt.preventDefault();
          renderFeedback(-1);
        }
      });
    });
}

feedback();
