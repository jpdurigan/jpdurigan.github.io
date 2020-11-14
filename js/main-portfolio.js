var listaTrabalhos = $(".trab");

$(filtrarPor("trab"));

function filtrarPor( classToSearchFor ) {

	if ($(`#btn-${classToSearchFor}`).hasClass("ativo")) {
		filtrarPor("trab");
		return;
	}

	$("#menu").find(".ativo").removeClass("ativo");
	$(`#btn-${classToSearchFor}`).addClass("ativo");

	var trabAtivos = 0;
	for (var i = 0; i < listaTrabalhos.length; i++) {
		if ($(listaTrabalhos[i]).hasClass(classToSearchFor)) {
			trabAtivos += 1;
			if ($(listaTrabalhos[i]).hasClass("escondido")) {
				$(listaTrabalhos[i]).fadeIn(200, function() {
					$(this).removeClass("escondido");
				})
			}

			if (trabAtivos % 2 == 0) {
				$(listaTrabalhos[i]).addClass("right");
				$(listaTrabalhos[i]).removeClass("left");
			} else {
				$(listaTrabalhos[i]).addClass("left");
				$(listaTrabalhos[i]).removeClass("right");
			}
		} else {
			$(listaTrabalhos[i]).fadeOut(200, function() {
				$(this).addClass("escondido");
			});

		}
	}
}
