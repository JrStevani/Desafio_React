"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function buscarDadosGitHub(nomeDeUsuario) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(`https://api.github.com/users/${nomeDeUsuario}`);
        if (!response.ok) {
            mostrarMensagemErro();
            throw new Error(`Erro ao buscar o usuário: ${response.statusText}`);
        }
        return response.json();
    });
}
function mostrarMensagemErro() {
    alert('Nenhum usuário encontrado.');
}
function atualizarHistorico(user) {
    const historyList = document.getElementById('history-list');
    const historyItem = document.createElement('div');
    historyItem.className = 'history-item';
    historyItem.innerHTML = `
        <a href="./formulario.html?html_url=${encodeURIComponent(user.id)}" target="_blank">
        <img src="${user.avatar_url}" alt="Avatar do usuário"></a>
        <div>
            <p><strong>${user.name || 'N/A'}</strong></p>
            <p>Usuário: ${user.login}</p>
            <p>Localização: ${user.location || 'Não informado'}</p>
        </div>
    `;
    historyList.appendChild(historyItem);
    const historySection = document.getElementById('history');
    historySection.style.display = 'block';
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const button = document.getElementById('myButton');
        const input = document.getElementById('username-input');
        button === null || button === void 0 ? void 0 : button.addEventListener('click', () => __awaiter(this, void 0, void 0, function* () {
            const username = input === null || input === void 0 ? void 0 : input.value.trim();
            if (!username) {
                alert('Por favor, insira um nome de usuário.');
                return;
            }
            try {
                const user = yield buscarDadosGitHub(username);
                const id_user = user.id.toString();
                setHref(id_user);
                const infoSection = document.getElementById('informacoes');
                document.getElementById('user-avatar').setAttribute('src', user.avatar_url);
                document.getElementById('user-name').innerText = `📑 Nome: ${user.name || 'N/A'}`;
                document.getElementById('user-login').innerText = `👤 Usuário: ${user.login}`;
                document.getElementById('user-location').innerText = `📍 Localização: ${user.location || 'Não informado'}`;
                let githubUserData = localStorage.getItem('githubUserData');
                let parsedUserData = githubUserData ? JSON.parse(githubUserData) : {};
                parsedUserData[id_user] = {
                    login: user.login,
                    avatar_url: user.avatar_url,
                    name: user.name,
                    location: user.location || "Não informado",
                    id: user.id,
                    followers: user.followers,
                    public_repos: user.public_repos,
                    repos_url: user.repos_url,
                    html_url: user.html_url
                };
                localStorage.setItem('githubUserData', JSON.stringify(parsedUserData));
                infoSection.style.display = 'block';
                atualizarHistorico(user);
            }
            catch (error) {
                console.error('Erro:', error);
            }
        }));
    });
}
function setHref(userId) {
    const elementId = 'url-html';
    const url = `./formulario.html?html_url=${userId}`;
    const element = document.getElementById(elementId);
    if (element) {
        element.setAttribute('href', url);
    }
    else {
        console.error(`Elemento com o ID "${elementId}" não encontrado ou não é um elemento <a>.`);
    }
}
document.addEventListener('DOMContentLoaded', main);
