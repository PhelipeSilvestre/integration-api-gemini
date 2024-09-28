// frontend/script.js
document
  .getElementById("generateButton")
  .addEventListener("click", async () => {
    const userInput = document.getElementById("userInput").value;

    try {
      const response = await fetch("http://localhost:3000/generate-idea", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input: userInput }),
      });

      const data = await response.json();

      if (response.ok) {
        // Verifique se candidates existem e é um array com pelo menos um elemento
        if (
          data.candidates &&
          Array.isArray(data.candidates) &&
          data.candidates.length > 0
        ) {
          // Acessando o conteúdo gerado
          const generatedIdea = data.candidates[0].content; // Acessando o conteúdo do primeiro candidato

          // Formatar o texto para remover marcações Markdown
          const formattedText = removeMarkdown(
            generatedIdea.parts.map((part) => part.text).join("")
          );

          // Exibindo o texto formatado
          document.getElementById("result").innerHTML = formattedText;
        } else {
          document.getElementById("result").innerText =
            "Erro: Resposta inválida do servidor.";
        }
      } else {
        document.getElementById("result").innerText = `Erro ao gerar ideia: ${
          data.error || "Erro desconhecido."
        }`;
      }
    } catch (error) {
      console.error("Error:", error);
      document.getElementById("result").innerText =
        "Erro: Ocorreu um problema ao gerar a ideia.";
    }
  });

// Função para remover marcações Markdown
function removeMarkdown(text) {
  // Remove cabeçalhos (ex: ## Dicas para Criar uma Startup)
  text = text.replace(/#{1,6}\s+/g, "");

  // Remove negrito (ex: **texto**)
  text = text.replace(/\*\*(.*?)\*\*/g, "$1");

  // Remove itálico (ex: *texto*)
  text = text.replace(/\*(.*?)\*/g, "$1");

  // Remove listas
  text = text.replace(/^\s*\*\s+/gm, "• "); // Converte listas com asterisco em marcadores

  // Remove quebras de linha extras
  text = text.replace(/\n+/g, "<br>");

  return text;
}
