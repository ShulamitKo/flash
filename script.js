class FlashEMDRApp {
    static initialDistressLevel = 5;

    constructor() {
        this.currentStage = 1;
        this.totalStages = 6;
        this.userData = {
            distressLevel: FlashEMDRApp.initialDistressLevel,
            positiveMemory: '',
            traumaticMemory: ''
        };
        
        window.appInstance = this;
        
        document.querySelectorAll('.stage').forEach(stage => {
            stage.classList.remove('active');
        });
        const introStage = document.getElementById('intro');
        if (introStage) {
            introStage.classList.add('active');
        }
        
        this.initializeEventListeners();
        this.initializeStage2();
        this.initializeStage3();
        this.initializeStage4();
        this.initializeStage6();
    }

    initializeEventListeners() {
        const startButton = document.getElementById('startButton');
        if (startButton) {
            startButton.addEventListener('click', () => this.moveToNextStage());
        }

        const startIntro = document.getElementById('startIntro');
        if (startIntro) {
            startIntro.addEventListener('click', () => {
                document.getElementById('intro').classList.remove('active');
                document.getElementById('stage1').classList.add('active');
            });
        }
    }

    initializeStage2() {
        const distressSlider = document.getElementById('distressLevel');
        const distressValue = document.getElementById('distressValue');
        const stage2Next = document.getElementById('stage2Next');

        if (distressSlider && distressValue) {
            distressSlider.value = this.userData.distressLevel;
            distressValue.textContent = this.userData.distressLevel;

            distressSlider.addEventListener('input', (e) => {
                const value = parseInt(e.target.value);
                distressValue.textContent = value;
                this.userData.distressLevel = value;
                FlashEMDRApp.initialDistressLevel = value;
                console.log("Updated distress level:", value);
            });
        }

        if (stage2Next) {
            stage2Next.addEventListener('click', () => {
                if (distressSlider) {
                    const finalValue = parseInt(distressSlider.value);
                    this.userData.distressLevel = finalValue;
                    FlashEMDRApp.initialDistressLevel = finalValue;
                    console.log("Final distress level saved:", finalValue);
                }
                this.moveToNextStage();
            });
        }
    }

    getSliderColor(percentage) {
        if (percentage <= 30) return '#4CAF50';  // ירוק לערכים נמוכים
        if (percentage <= 70) return '#FFA726';  // כתום לערכים בינוניים
        return '#EF5350';  // אדום לערכים גבוהים
    }

    initializeStage3() {
        const positiveMemory = document.getElementById('positiveMemory');
        const stage3Next = document.getElementById('stage3Next');
        
        if (stage3Next) {
            stage3Next.addEventListener('click', () => {
                if (positiveMemory && positiveMemory.value.trim()) {
                    this.userData.positiveMemory = positiveMemory.value;
                    console.log("Saving positive memory:", this.userData.positiveMemory);
                    this.moveToNextStage();
                    
                    this.initializeStage4();
                } else {
                    alert('אנא תאר את הזיכרון החיובי שלך');
                }
            });
        }
    }

    initializeStage4() {
        const treatment = new TreatmentProcess(this);
    }

    initializeStage5() {
        console.log("Stage 5 initialization started");
        const previousDistressLevel = document.getElementById('previousDistressLevel');
        const newDistressLevel = document.getElementById('newDistressLevel');
        const newDistressValue = document.getElementById('newDistressValue');
        const stage5Next = document.getElementById('stage5Next');
        const resultsSection = document.querySelector('.results-section');
        const distressReduction = document.getElementById('distressReduction');
        const recommendation = document.querySelector('.recommendation');

        if (previousDistressLevel) {
            console.log("Setting initial distress level to:", FlashEMDRApp.initialDistressLevel);
            previousDistressLevel.textContent = FlashEMDRApp.initialDistressLevel;
        }

        if (stage5Next) {
            stage5Next.addEventListener('click', () => {
                document.getElementById('stage5').classList.remove('active');
                document.getElementById('stage6').classList.add('active');
            });
        }

        if (newDistressLevel && newDistressValue) {
            newDistressLevel.addEventListener('input', (e) => {
                const newValue = parseInt(e.target.value);
                newDistressValue.textContent = newValue;
                
                const oldValue = FlashEMDRApp.initialDistressLevel;
                const change = newValue - oldValue;
                
                if (distressReduction) {
                    if (change > 0) {
                        distressReduction.textContent = `עלתה ב-${change}`;
                    } else if (change < 0) {
                        distressReduction.textContent = `ירדה ב-${Math.abs(change)}`;
                    } else {
                        distressReduction.textContent = `נשארה ללא שינוי`;
                    }
                }

                if (recommendation) {
                    if (change > 0) {
                        recommendation.innerHTML = `
                            <p class="recommendation-text warning">
                                <i class="fas fa-exclamation-circle"></i>
                                מומלץ לפנות לאיש מקצוע לקבלת עזרה נוספת
                            </p>
                        `;
                    } else if (change === 0) {
                        recommendation.innerHTML = `
                            <p class="recommendation-text">
                                <i class="fas fa-info-circle"></i>
                                ניתן לנסות שוב את התרגיל להפחתת רמת המצוקה
                            </p>
                        `;
                    } else {
                        if (Math.abs(change) < 3) {
                            recommendation.innerHTML = `
                                <p class="recommendation-text">
                                    <i class="fas fa-info-circle"></i>
                                    ניתן לחזור על התרג מספר פעמים להפחתה נוספת
                                </p>
                            `;
                        } else {
                            recommendation.innerHTML = `
                                <p class="recommendation-text success">
                                    <i class="fas fa-check-circle"></i>
                                    התרגיל עבד בהצלחה! ניתן להשתמש בו שוב בעת הצורך
                                </p>
                            `;
                        }
                    }
                }

                if (resultsSection) {
                    resultsSection.style.display = 'block';
                }
            });
        }
    }

    initializeStage6() {
        const restartButton = document.getElementById('restartButton');
        
        if (restartButton) {
            restartButton.addEventListener('click', () => {
                document.querySelectorAll('.stage').forEach(stage => {
                    stage.classList.remove('active');
                });
                
                document.getElementById('stage2').classList.add('active');
                
                this.currentStage = 2;
                this.userData = {
                    distressLevel: FlashEMDRApp.initialDistressLevel,
                    positiveMemory: '',
                    traumaticMemory: ''
                };
                
                this.initializeStage2();
            });
        }
    }

    moveToNextStage() {
        if (this.currentStage === 2) {
            if (this.userData.distressLevel === 0) {
                alert('אנא דרג את רמת המצוקה שלך');
                return;
            }
        }
        
        if (this.currentStage === 3) {
            if (!this.userData.positiveMemory.trim()) {
                alert('אנא תאר את הזיכרון החיובי שלך');
                return;
            }
        }
        
        const currentStageElement = document.getElementById(`stage${this.currentStage}`);
        currentStageElement.classList.remove('active');
        
        this.currentStage++;
        console.log("Moving to stage:", this.currentStage);
        
        if (this.currentStage <= this.totalStages) {
            const nextStageElement = document.getElementById(`stage${this.currentStage}`);
            if (nextStageElement) {
                nextStageElement.classList.add('active');
                if (this.currentStage === 5) {
                    console.log("Initializing stage 5");
                    setTimeout(() => {
                        this.initializeStage5();
                    }, 0);
                }
            }
        }
    }
}

class TreatmentProcess {
    constructor(app) {
        this.app = app;
        this.positiveMemory = app.userData.positiveMemory;
        
        this.elements = {
            instruction: document.getElementById('currentInstruction'),
            timer: document.getElementById('processTimer'),
            heart: document.getElementById('heartAnimation'),
            eye: document.getElementById('eyeAnimation'),
            memoryDisplay: document.getElementById('displayPositiveMemory'),
            memoryBox: document.querySelector('.memory-box')
        };

        if (this.elements.memoryDisplay) {
            this.elements.memoryDisplay.textContent = this.positiveMemory;
            console.log("Setting memory display:", this.positiveMemory);
        }

        this.isPaused = false;
        this.currentTimer = null;
        this.currentPhase = null;
        
        this.startButton = document.getElementById('startTreatment');
        this.pauseButton = document.getElementById('pauseTreatment');
        this.endButton = document.getElementById('endTreatment');
        this.pretreatmentSection = document.getElementById('pretreatment-section');
        this.treatmentSection = document.getElementById('treatment-section');
        
        this.initializeButtons();

        document.querySelectorAll('.timeline-step').forEach((step, index) => {
            step.style.cursor = 'pointer';
            step.addEventListener('click', () => this.jumpToPhase(index + 1));
        });
    }

    initializeButtons() {
        if (this.startButton) {
            this.startButton.addEventListener('click', () => {
                this.pretreatmentSection.style.display = 'none';
                this.treatmentSection.style.display = 'block';
                this.start();
            });
        }

        if (this.pauseButton) {
            this.pauseButton.addEventListener('click', () => this.togglePause());
        }

        if (this.endButton) {
            this.endButton.addEventListener('click', () => {
                if (confirm('האם אתה בטוח שברצונך לצאת מהטיפול?')) {
                    document.getElementById('stage4').classList.remove('active');
                    document.getElementById('stage5').classList.add('active');
                    this.app.initializeStage5();
                }
            });
        }
    }

    async start() {
        this.updateInstruction('נתחיל בטיפוף עדין עם הזיכרון החיובי');
        await this.wait(3);

        try {
            await this.jumpToPhase(1);
        } catch (error) {
            console.error('Error during treatment:', error);
        }
    }

    async runSets() {
        for (let i = 0; i < 5; i++) {
            this.updateInstruction(`סט ${i + 1} מתוך 5: תופף והתמקד בזיכרון החיובי`);
            this.elements.heart.classList.add('beating');
            await this.runTimer(5);
            this.elements.heart.classList.remove('beating');

            this.updateInstruction('מצמץ 3 פעמים');
            await this.blinkThreeTimes();

            if (i < 4) await this.wait(1);
        }
    }

    async blinkThreeTimes() {
        this.elements.heart.style.display = 'none';
        this.elements.eye.style.display = 'block';
        
        for (let i = 0; i < 3; i++) {
            this.elements.eye.classList.add('blinking');
            await this.wait(0.3);
            this.elements.eye.classList.remove('blinking');
            await this.wait(0.2);
        }
        
        this.elements.eye.style.display = 'none';
        this.elements.heart.style.display = 'block';
    }

    async runTimer(seconds) {
        return new Promise(resolve => {
            let timeLeft = seconds;
            this.elements.timer.textContent = timeLeft;
            
            const timer = setInterval(() => {
                if (this.isPaused) return;
                
                timeLeft--;
                this.elements.timer.textContent = timeLeft;
                
                if (timeLeft <= 0) {
                    clearInterval(timer);
                    resolve();
                }
            }, 1000);
            
            this.currentTimer = timer;
        });
    }

    togglePause() {
        this.isPaused = !this.isPaused;
        const icon = this.pauseButton.querySelector('i');
        const text = this.pauseButton.querySelector('span');
        
        if (this.isPaused) {
            icon.className = 'fas fa-play control-icon';
            text.textContent = 'המשך טיפול';
            this.elements.heart.classList.remove('beating', 'beating-fast');
        } else {
            icon.className = 'fas fa-pause control-icon';
            text.textContent = 'השהה טיפול';
            if (this.currentPhase === 3) {
                this.elements.heart.classList.add('beating-fast');
            } else {
                this.elements.heart.classList.add('beating');
            }
        }
    }

    updatePhase(phaseNumber) {
        document.querySelectorAll('.timeline-step').forEach((step, index) => {
            if (index + 1 === phaseNumber) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });
        this.currentPhase = phaseNumber;
    }

    updateInstruction(text) {
        if (this.elements.instruction) {
            this.elements.instruction.innerHTML = text;
        }
    }

    wait(seconds) {
        return new Promise(resolve => setTimeout(resolve, seconds * 1000));
    }

    complete() {
        this.updateInstruction(`
            <div class="completion-message">
                <p>סיימנו שלב זה</p>
                <button id="continueButton" class="primary-button">
                    <i class="fas fa-arrow-left"></i>
                    בוא נמשיך
                </button>
            </div>
        `);
        
        if (this.pauseButton) this.pauseButton.style.display = 'none';
        if (this.endButton) this.endButton.style.display = 'none';

        setTimeout(() => {
            const continueButton = document.getElementById('continueButton');
            if (continueButton) {
                continueButton.addEventListener('click', () => {
                    document.getElementById('stage4').classList.remove('active');
                    document.getElementById('stage5').classList.add('active');
                    this.app.initializeStage5();
                });
            }
        }, 0);
    }

    async jumpToPhase(phaseNumber) {
        clearInterval(this.currentTimer);
        this.elements.heart.classList.remove('beating', 'beating-fast');
        this.elements.eye.style.display = 'none';
        this.elements.heart.style.display = 'block';

        switch(phaseNumber) {
            case 1:
                this.updatePhase(1);
                this.updateInstruction('טיפוף ראשוני עם הזיכרון החיובי');
                this.elements.heart.classList.add('beating');
                await this.runTimer(20);
                this.elements.heart.classList.remove('beating');
                await this.jumpToPhase(2);
                break;
            case 2:
                this.updatePhase(2);
                await this.runSets();
                await this.jumpToPhase(3);
                break;
            case 3:
                this.updatePhase(3);
                if (this.elements.memoryBox) {
                    this.elements.memoryBox.style.display = 'none';
                }
                this.elements.heart.classList.add('beating-fast');
                this.updateInstruction('התמקד לרגע בזיכרון המטריד תוך טיפוף מהיר');
                await this.runTimer(5);
                this.elements.heart.classList.remove('beating-fast');
                if (this.elements.memoryBox) {
                    this.elements.memoryBox.style.display = 'block';
                }
                await this.jumpToPhase(4);
                break;
            case 4:
                this.updatePhase(4);
                await this.runSets();
                this.complete();
                break;
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const app = new FlashEMDRApp();
}); 