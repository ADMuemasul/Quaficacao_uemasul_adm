from flask import Flask, render_template, request, redirect, url_for, session, flash
from datetime import datetime, timedelta
import os
import glob

app = Flask(__name__)
app.secret_key = 'sua_chave_secreta_aqui'  # Em produção, use uma chave segura

# Configurações do projeto
CONFIG = {
    'limite_maximo': 50,  # Limite máximo de inscrições
    'data_inicio_inscricoes': '15/01/2025 às 08:00',  # Data de início das inscrições
    'tempo_restante': '2025-01-15T08:00:00',  # Data para o cronômetro
}

# Simulação de dados de inscritos (em produção, isso viria de um banco de dados)
inscritos_simulados = [
    {
        'nome_completo': 'João Silva Santos',
        'idade': 18,
        'cidade': 'Imperatriz',
        'escolaridade': 'Ensino Médio Completo',
        'data_inscricao': datetime.now() - timedelta(days=2),
        'status': 'aprovado'
    },
    {
        'nome_completo': 'Maria Oliveira Costa',
        'idade': 19,
        'cidade': 'Imperatriz',
        'escolaridade': 'Ensino Médio Completo',
        'data_inscricao': datetime.now() - timedelta(days=1),
        'status': 'pendente'
    },
    {
        'nome_completo': 'Pedro Santos Lima',
        'idade': 20,
        'cidade': 'Imperatriz',
        'escolaridade': 'Ensino Médio Completo',
        'data_inscricao': datetime.now() - timedelta(hours=5),
        'status': 'excedente'
    }
]

def verificar_status_inscricoes():
    """Verifica o status das inscrições baseado na data atual"""
    data_inicio = datetime.strptime(CONFIG['tempo_restante'], '%Y-%m-%dT%H:%M:%S')
    agora = datetime.now()
    
    inscricoes_iniciadas = agora >= data_inicio
    # Sempre considerar inscrições como encerradas
    inscricoes_abertas = False
    
    return {
        'inscricoes_iniciadas': inscricoes_iniciadas,
        'inscricoes_abertas': inscricoes_abertas,
        'vagas_restantes': 0,  # Sem vagas restantes
        'limite_maximo': CONFIG['limite_maximo']
    }

def obter_fotos_galeria():
    """Obtém todas as fotos da galeria da pasta Photos-1-001"""
    # Lista específica das fotos da pasta Photos-1-001
    fotos_photos_001 = [
        'Imagem do WhatsApp de 2025-09-12 à(s) 13.02.58_08b68374.jpg',
        'Imagem do WhatsApp de 2025-09-12 à(s) 13.03.05_f2deb95c.jpg',
        'Imagem do WhatsApp de 2025-10-22 à(s) 09.56.29_4745889b.jpg',
        'IMG-20251021-WA0143.jpg',
        'IMG-20251021-WA0144.jpg',
        'IMG-20251021-WA0145.jpg',
        'IMG-20251021-WA0146.jpg',
        'IMG_2241.JPG',
        'IMG_2242.JPG',
        'IMG_2243.JPG',
        'IMG_2244.JPG',
        'IMG_2245.JPG',
        'IMG_2246.JPG',
        'IMG_2247.JPG',
        'IMG_2248.JPG',
        'IMG_2249.JPG',
        'IMG_2250.JPG',
        'IMG_2251.JPG',
        'IMG_2252.JPG',
        'IMG_2253.JPG',
        'IMG_2254.JPG',
        'IMG_2255.JPG',
        'IMG_2256.JPG',
        'IMG_2257.JPG',
        'IMG_2258.JPG',
        'IMG_2259.JPG',
        'IMG_2260.JPG',
        'IMG_2263.JPG',
        'IMG_2266.JPG',
        'IMG_2267.JPG',
        'IMG_2268.JPG',
        'IMG_2269.JPG',
        'IMG_2270.JPG',
        'IMG_2271.JPG',
        'IMG_2272.JPG',
        'IMG_2273.JPG',
        'IMG_2274.JPG',
        'IMG_2275.JPG',
        'IMG_2276.JPG',
        'IMG_2277.JPG',
        'IMG_2278.JPG'
    ]
    
    # Construir caminhos completos para as fotos
    fotos_completas = []
    for foto in fotos_photos_001:
        caminho_foto = os.path.join('static', 'images', foto)
        if os.path.exists(caminho_foto):
            fotos_completas.append(caminho_foto)
    
    # Ordenar as fotos por nome
    fotos_completas.sort()
    return fotos_completas

def paginar_fotos(fotos, pagina=1, fotos_por_pagina=6):
    """Pagina as fotos da galeria"""
    total_fotos = len(fotos)
    total_paginas = (total_fotos + fotos_por_pagina - 1) // fotos_por_pagina
    
    inicio = (pagina - 1) * fotos_por_pagina
    fim = inicio + fotos_por_pagina
    
    fotos_pagina = fotos[inicio:fim]
    
    return {
        'fotos': fotos_pagina,
        'pagina_atual': pagina,
        'total_paginas': total_paginas,
        'total_fotos': total_fotos,
        'tem_proxima': pagina < total_paginas,
        'tem_anterior': pagina > 1
    }

@app.route('/')
def index():
    """Página inicial"""
    status = verificar_status_inscricoes()
    
    # Obter página da galeria (padrão: página 1)
    pagina_galeria = request.args.get('pagina', 1, type=int)
    
    # Obter fotos da galeria com paginação
    todas_fotos = obter_fotos_galeria()
    dados_galeria = paginar_fotos(todas_fotos, pagina_galeria, 6)
    
    return render_template('index.html',
                         inscricoes_iniciadas=status['inscricoes_iniciadas'],
                         inscricoes_abertas=status['inscricoes_abertas'],
                         vagas_restantes=status['vagas_restantes'],
                         limite_maximo=status['limite_maximo'],
                         data_inicio_inscricoes=CONFIG['data_inicio_inscricoes'],
                         tempo_restante=CONFIG['tempo_restante'],
                         inscritos=inscritos_simulados,
                         dados_galeria=dados_galeria)

@app.route('/inscricao', methods=['GET', 'POST'])
def inscricao():
    """Página de inscrição"""
    status = verificar_status_inscricoes()
    
    if not status['inscricoes_abertas']:
        if not status['inscricoes_iniciadas']:
            flash('As inscrições ainda não começaram!', 'error')
        else:
            flash('As inscrições foram encerradas!', 'error')
        return redirect(url_for('index'))
    
    if request.method == 'POST':
        # Aqui você processaria os dados do formulário
        flash('Inscrição realizada com sucesso!', 'success')
        return redirect(url_for('sucesso'))
    
    return render_template('inscricao.html')

@app.route('/sucesso')
def sucesso():
    """Página de sucesso após inscrição"""
    return render_template('sucesso.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    """Página de login administrativo"""
    if request.method == 'POST':
        # Sempre mostrar mensagem de usuário não autorizado
        flash('Usuário não autorizado!', 'error')
    
    return render_template('login.html')

@app.route('/logout')
def logout():
    """Logout do usuário"""
    session.clear()
    flash('Logout realizado com sucesso!', 'success')
    return redirect(url_for('index'))

@app.route('/dashboard')
def dashboard():
    """Dashboard administrativo"""
    if not session.get('user_id'):
        flash('Você precisa fazer login para acessar esta página!', 'error')
        return redirect(url_for('login'))
    
    return render_template('dashboard.html', inscritos=inscritos_simulados)

@app.route('/admin')
def admin():
    """Painel administrativo"""
    if not session.get('user_id'):
        flash('Você precisa fazer login para acessar esta página!', 'error')
        return redirect(url_for('login'))
    
    return render_template('admin.html', inscritos=inscritos_simulados)

@app.route('/visualizar_inscricoes')
def visualizar_inscricoes():
    """Visualizar inscrições"""
    if not session.get('user_id'):
        flash('Você precisa fazer login para acessar esta página!', 'error')
        return redirect(url_for('login'))
    
    return render_template('visualizar_inscricoes.html', inscritos=inscritos_simulados)

@app.errorhandler(404)
def not_found(error):
    """Página de erro 404"""
    return render_template('404.html'), 404

@app.errorhandler(500)
def internal_error(error):
    """Página de erro 500"""
    return render_template('500.html'), 500

if __name__ == '__main__':
    # Criar diretórios necessários se não existirem
    os.makedirs('static/css', exist_ok=True)
    os.makedirs('static/js', exist_ok=True)
    os.makedirs('static/images', exist_ok=True)
    os.makedirs('templates', exist_ok=True)
    
    print("Iniciando servidor Flask...")
    print("Acesse: http://localhost:5000")
    print("Login admin: admin / admin123")
    print("Para parar: Ctrl+C")
    
    app.run(debug=True, host='0.0.0.0', port=5000)
