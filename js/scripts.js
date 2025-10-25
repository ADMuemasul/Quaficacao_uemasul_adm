document.addEventListener('DOMContentLoaded', function() {
  // Animação do header ao scroll
  window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    
    // Efeito parallax no banner
    const banner = document.querySelector('.banner-container img');
    if (banner) {
      const scrollPosition = window.pageYOffset;
      banner.style.transform = 'scale(' + (1 + scrollPosition * 0.0005) + ')';
    }
  });

  // Animação do hero text
  const heroText = document.querySelector('.hero-text');
  if (heroText) {
    heroText.classList.add('animate');
  }

  const btnGold = document.querySelector('.btn-gold');
  if (btnGold) {
    setTimeout(() => {
      btnGold.classList.add('animate');
    }, 500);
  }

  // Animação das features ao aparecer na tela
  const animateOnScroll = () => {
    const elements = document.querySelectorAll('.feature-card, .section-title, .section-subtitle, .center-image img');
    
    elements.forEach(element => {
      const elementPosition = element.getBoundingClientRect().top;
      const screenPosition = window.innerHeight / 1.2;
      
      if (elementPosition < screenPosition) {
        const animation = element.dataset.animation || 'fadeIn';
        const delay = element.dataset.delay || '0s';
        
        element.style.animation = `${animation} 0.8s ease ${delay} forwards`;
        element.classList.add('animate__animated', `animate__${animation}`);
      }
    });
  };

  window.addEventListener('scroll', animateOnScroll);
  animateOnScroll(); // Dispara uma vez ao carregar

  // Animação dos ícones ao hover
  const featureCards = document.querySelectorAll('.feature-card');
  featureCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      const iconContainer = this.querySelector('.icon-container');
      const icon = this.querySelector('.feature-icon');
      
      if (iconContainer) iconContainer.style.transform = 'scale(1.1)';
      if (icon) icon.style.transform = 'scale(1.1)';
    });
    
    card.addEventListener('mouseleave', function() {
      const iconContainer = this.querySelector('.icon-container');
      const icon = this.querySelector('.feature-icon');
      
      if (iconContainer) iconContainer.style.transform = 'scale(1)';
      if (icon) icon.style.transform = 'scale(1)';
    });
  });

  // Rotação 3D da imagem central
  const centerImage = document.querySelector('.center-image img');
  if (centerImage) {
    setTimeout(() => {
      centerImage.classList.add('animate');
    }, 800);
  }

  // Animação dos contadores
  function animateCounters() {
    const counters = document.querySelectorAll('.counter');
    const speed = 200;
    
    counters.forEach(counter => {
      const target = +counter.getAttribute('data-target');
      const count = +counter.innerText;
      const increment = target / speed;
      
      if (count < target) {
        counter.innerText = Math.ceil(count + increment);
        setTimeout(animateCounters, 1);
      } else {
        counter.innerText = target;
      }
    });
  }
  
  // Ativar animações quando a seção estiver visível
  const aboutSection = document.querySelector('.about-section');
  
  if (aboutSection) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Ativar animações
          const sectionTitle = document.querySelector('.about-section .section-title');
          const sectionSubtitle = document.querySelector('.about-section .section-subtitle');
          const mainImage = document.querySelector('.about-section .main-image');
          const featureRow = document.querySelector('.about-section .feature-row');
          
          if (sectionTitle) sectionTitle.classList.add('animate__fadeInUp');
          if (sectionSubtitle) sectionSubtitle.classList.add('animate__fadeInUp');
          if (mainImage) mainImage.classList.add('animate__zoomIn');
          if (featureRow) featureRow.classList.add('animate__fadeIn');
          
          // Iniciar contadores
          animateCounters();
          
          // Não observar mais depois de ativar
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    
    observer.observe(aboutSection);
  }

  // Animação da seção de serviços
  const serviceCards = document.querySelectorAll('.service-card');
  const ctaButton = document.querySelector('.cta-button');
  
  const servicesSection = document.querySelector('.services-section');
  if (servicesSection) {
    const servicesObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          serviceCards.forEach((card, index) => {
            setTimeout(() => {
              card.classList.add('animate__fadeInUp');
            }, index * 100);
          });
          
          if (ctaButton) {
            setTimeout(() => {
              ctaButton.classList.add('animate__fadeInUp');
            }, 700);
          }
          
          servicesObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    
    servicesObserver.observe(servicesSection);
  }
  
  // Efeito de hover nos cards de serviços
  serviceCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-10px)';
    });
    
    card.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
    });
  });

  // Galeria - Inicializa o modal
  const imageModal = document.getElementById('imageModal');
  if (imageModal) {
    const modal = new bootstrap.Modal(imageModal);
    
    // Configura os botões de preview
    document.querySelectorAll('.preview-btn').forEach(button => {
      button.addEventListener('click', function() {
        const imgSrc = this.getAttribute('data-src');
        const title = this.parentElement.querySelector('h4').textContent;
        
        document.getElementById('modalImage').src = imgSrc;
        document.getElementById('modalTitle').textContent = title;
        modal.show();
      });
    });
  }
  
  // Animação da galeria ao rolar até a seção
  const galleryItems = document.querySelectorAll('.gallery-item');
  
  const gallerySection = document.querySelector('.gallery-section');
  if (gallerySection) {
    const galleryObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }, index * 100);
          galleryObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    
    galleryItems.forEach(item => {
      item.style.opacity = '0';
      item.style.transform = 'translateY(30px)';
      item.style.transition = 'all 0.5s ease';
      galleryObserver.observe(item);
    });
  }

  // Animação da equipe ao rolar até a seção
  const teamCards = document.querySelectorAll('.team-card');
  
  const teamSection = document.querySelector('.team-section');
  if (teamSection) {
    const teamObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }, index * 100);
          teamObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    
    teamCards.forEach(card => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(30px)';
      card.style.transition = 'all 0.5s ease';
      teamObserver.observe(card);
    });
  }

  // Função para enviar formulário via WhatsApp
  window.sendWhatsApp = function() {
    const nome = document.getElementById('nome-whatsapp')?.value;
    const idade = document.getElementById('idade-whatsapp')?.value;
    const cidade = document.getElementById('cidade-whatsapp')?.value;
    
    if (nome && idade && cidade) {
      const message = `Olá, gostaria de me inscrever no curso de qualificação.%0AMeu nome é ${nome},%0ATenho ${idade} anos%0AMoro em ${cidade}%0A%0AQual é o próximo passo?`;
      window.open(`https://wa.me/5599988585269?text=${message}`, '_blank');
    }
  };

  // Smooth scrolling para links internos
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // Validação de formulários em tempo real
  const forms = document.querySelectorAll('form');
  forms.forEach(form => {
    const inputs = form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
      input.addEventListener('blur', function() {
        validateField(this);
      });
      
      input.addEventListener('input', function() {
        clearFieldError(this);
      });
    });
  });

  function validateField(field) {
    const value = field.value.trim();
    const type = field.type;
    let isValid = true;
    let message = '';

    // Validações básicas
    if (field.hasAttribute('required') && !value) {
      isValid = false;
      message = 'Este campo é obrigatório';
    } else if (type === 'email' && value && !isValidEmail(value)) {
      isValid = false;
      message = 'Digite um e-mail válido';
    } else if (field.name === 'idade' && value && (parseInt(value) < 14 || parseInt(value) > 35)) {
      isValid = false;
      message = 'A idade deve estar entre 14 e 35 anos';
    }

    if (!isValid) {
      showFieldError(field, message);
    } else {
      clearFieldError(field);
    }

    return isValid;
  }

  function showFieldError(field, message) {
    clearFieldError(field);
    field.classList.add('is-invalid');
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'invalid-feedback';
    errorDiv.textContent = message;
    
    field.parentNode.appendChild(errorDiv);
  }

  function clearFieldError(field) {
    field.classList.remove('is-invalid');
    const errorDiv = field.parentNode.querySelector('.invalid-feedback');
    if (errorDiv) {
      errorDiv.remove();
    }
  }

  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Auto-hide alerts (excluindo cronômetro e outros elementos importantes)
  const alerts = document.querySelectorAll('.alert:not(.flash-message-permanent)');
  alerts.forEach(alert => {
    // Não remover se for parte do cronômetro ou elemento de contato
    if (alert.closest('.countdown-container') || 
        alert.closest('.contact-section') || 
        alert.classList.contains('alert-success') ||
        alert.classList.contains('alert-warning')) {
      return; // Pular este alert
    }
    
    setTimeout(() => {
      alert.style.opacity = '0';
      setTimeout(() => {
        alert.remove();
      }, 300);
    }, 5000);
  });
}); 