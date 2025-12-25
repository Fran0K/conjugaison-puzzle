
export type Language = 'fr' | 'en' | 'zh' | 'ja';

export interface LocalizedGrammarRule {
  title: string;
  formula: string;
  description: string;
  example: string;
  details?: {
    label: string;
    text: string;
    examples?: string;
  }[];
}


export const TRANSLATIONS = {
  fr: {
    ui: {
      title: "ConjuPuzzle",
      score: "Score",
      settings: "Paramètres",
      rules: "Les règles de conjugaison",
      about: "À propos",
      objective: "Objectif",
      hint: "Indice",
      stem_zone: "Base",
      ending_zone: "Fin",
      stems_tray: "Base",
      endings_tray: "Fin",
      check: "Vérifier",
      skip: "Passer",
      next: "Suivant",
      loading: "Chargement...",
      error_title: "Erreur",
      error_desc: "Données inaccessibles.",
      retry: "Réessayer",
      correct: "Correct ! Bien joué.",
      wrong: "Oups ! Essaie encore.",
      explanation: "Explication",
      filter_title: "Choisir les Temps",
      filter_desc: "Sélectionnez les temps à pratiquer.",
      Detail:"Détails",
      select_all: "Tout",
      deselect_all: "Rien",
      cancel: "Annuler",
      validate: "Valider",
      regular: "Régulier",
      irregular: "Irrégulier",
      about_desc: "ConjuPuzzle aide les apprenants à maîtriser la conjugaison des verbes français en assemblant radicaux et terminaisons.",
      author: "Created By",
      version: "v1.0.0",
      how_to_title: "Comment jouer ?",
      step_1_title: "Lire l'objectif",
      step_1_desc: "Le panneau supérieur indique le pronom, le verbe et le temps.",
      step_2_title: "Comprendre la logique",
      step_2_desc: "La conjugaison se construit souvent ainsi : Base + Terminaison.",
      step_3_title: "Glisser-Déposer",
      step_3_desc: "Choisissez les pièces dans le plateau et placez-les dans les zones.",
      step_4_title: "Vérifier",
      step_4_desc: "Cliquez sur vérifier pour valider votre réponse !",
      // Tutorial
      tour_prev: "Précédent",
      tour_next: "Suivant",
      tour_finish: "Compris !",
      tour_obj_title: "Votre Mission",
      tour_obj_desc: "Voici le verbe et le temps à conjuguer. Lisez-le attentivement !",
      tour_tray_title: "Les Pièces",
      tour_tray_desc: "Trouvez les bons morceaux (Base et Terminaison) dans ce plateau.",
      tour_zone_title: "Assemblage",
      tour_zone_desc: "Glissez les pièces ici pour construire la conjugaison.",
      tour_settings_title: "Paramètres",
      tour_settings_desc: "Changez les temps (Présent, Futur...) ici.",
      tour_lang_title: "Langue",
      tour_lang_desc: "Changez la langue de l'interface ici.",
      tour_grammar_title: "Aide Grammaticale",
      tour_grammar_desc: "Un doute ? Cliquez sur ce livre pour voir toutes les règles de conjugaison.",
      // Onboarding Modal
      welcome_title: "Bienvenue sur ConjuPuzzle",
      welcome_subtitle: "Apprenez la conjugaison française en jouant.",
      onboarding_logic_title: "La Logique",
      onboarding_logic_desc: "La plupart des verbes se construisent ainsi : Base + Terminaison.",
      onboarding_action_title: "Votre Mission",
      onboarding_action_desc: "Glissez les pièces du plateau vers les zones vides pour former le verbe conjugué.",
      start_game: "Commencer",
      restart_tutorial: "Relancer le tutoriel"
    },
    tenses: {
      "Présent": "Présent",
      "Imparfait": "Imparfait",
      "Futur Simple": "Futur Simple",
      "Passé Simple": "Passé Simple",
      "Conditionnel Présent": "Conditionnel Présent",
      "Subjonctif Présent": "Subjonctif Présent",
      "Subjonctif Imparfait": "Subjonctif Imparfait",
      "Passé Composé": "Passé Composé",
      "Plus-que-parfait": "Plus-que-parfait",
      "Futur Antérieur": "Futur Antérieur",
      "Passé Antérieur": "Passé Antérieur",
      "Conditionnel Passé": "Conditionnel Passé",
      "Subjonctif Passé": "Subjonctif Passé",
      "Subjonctif Plus-que-parfait": "Subjonctif P.Q.P."
    },
    rules: {
      "Présent": {
        "title": "Présent",
        "formula": "Radical de l’infinitif + terminaisons du présent (3 groupes)",
        "description": "Temps de base pour exprimer une action actuelle, une habitude ou une vérité générale.",
        "example": "Je parle, je finis, je prends",
        "details": [
          {
            "label": "1er groupe (-er)",
            "text": "Radical de l’infinitif sans -er + e, es, e, ons, ez, ent",
            "examples": "je parle, nous parlons"
          },
          {
            "label": "2e groupe (-ir)",
            "text": "Radical de l’infinitif sans -ir + is, is, it, issons, issez, issent",
            "examples": "je finis, nous finissons"
          },
          {
            "label": "3e groupe",
            "text": "Radicaux et terminaisons variables selon le verbe",
            "examples": "je prends, nous venons"
          }
        ]
      },
      "Imparfait": {
        "title": "Imparfait",
        "formula": "Présent (nous) - ons + terminaisons de l’imparfait",
        "description": "TTemps du passé pour exprimer une habitude, une description ou une action en cours.",
        "example": "Je parlais, je finissais, je prenais",
        "details": [
          {
            "label": "Formation générale",
            "text": "Base du présent à la 1re personne du pluriel sans -ons + ais, ais, ait, ions, iez, aient",
            "examples": "nous parlons → je parlais"
          }
        ]
      },
      "Futur Simple": {
        "title": "Futur Simple",
        "formula": "Infinitif + terminaisons du futur simple",
        "description": "Temps pour exprimer une action à venir ou une certitude future.",
        "example": "Je parlerai, je finirai, je prendrai",
        "details": [
          {
            "label": "Formation générale",
            "text": "Infinitif (ou radical irrégulier) + ai, as, a, ons, ez, ont",
            "examples": "parler → je parlerai"
          }
        ]
      },
      // "Passé Simple": {
      //   "title": "Passé Simple",
      //   "formula": "Radical + terminaisons du passé simple",
      //   "description": "Temps littéraire du passé exprimant une action ponctuelle et achevée.",
      //   "example": "Je parlai, je finis, je pris",
      //   "details": [
      //     {
      //       "label": "Usage",
      //       "text": "Employé principalement à l’écrit dans les récits et textes littéraires",
      //       "examples": "il entra, ils partirent"
      //     }
      //   ]
      // },
      "Conditionnel Présent": {
        "title": "Conditionnel Présent",
        "formula": "Infinitif + terminaisons",
        "description": "Temps pour exprimer une hypothèse, une condition ou une demande polie.",
        "example": "Je parlerais, je finirais, je prendrais",
        "details": [
          {
            "label": "Formation générale",
            "text": "Infinitif (ou radical du futur) + ais, ais, ait, ions, iez, aient",
            "examples": "venir → je viendrais"
          }
        ]
      },
      "Subjonctif Présent": {
        "title": "Subjonctif Présent",
        "formula": "Radical du présent (ils) + terminaisons du subjonctif",
        "description": "Mode utilisé pour exprimer le doute, le souhait, la nécessité ou le sentiment.",
        "example": "Que je parle, que je finisse, que je prenne",
        "details": [
          {
            "label": "Formation générale",
            "text": "Base de la 3e personne du pluriel au présent sans -ent + e, es, e, ions, iez, ent",
            "examples": "ils parlent → que je parle"
          }
        ]
      },
      "Subjonctif Imparfait": {
        "title": "Subjonctif Imparfait",
        "formula": "Radical du passé simple + terminaisons du subjonctif imparfait",
        "description": "Temps littéraire exprimant une action incertaine dans le passé.",
        "example": "Que je parlasse, que je finisse, que je prisse",
        "details": [
          {
            "label": "Usage",
            "text": "Employé uniquement dans la langue écrite et littéraire",
            "examples": "qu’il vînt, qu’ils eussent"
          }
        ]
      },
      "Passé Composé": {
        "title": "Passé Composé",
        "formula": "Auxiliaire (avoir/être) au présent + participe passé",
        "description": "Temps du passé exprimant une action achevée avec un lien au présent.",
        "example": "J’ai parlé, je suis allé",
        "details": [
          {
            "label": "Avec avoir",
            "text": "Avoir au présent + participe passé",
            "examples": "j’ai fini"
          },
          {
            "label": "Avec être",
            "text": "Être au présent + participe passé (verbes de mouvement et pronominaux)",
            "examples": "je suis venu"
          }
        ]
      },
      "Plus-que-parfait": {
        "title": "Plus-que-parfait",
        "formula": "Auxiliaire (avoir/être) à l’imparfait + participe passé",
        "description": "Temps du passé exprimant une action antérieure à une autre action passée.",
        "example": "J’avais parlé, j’étais parti",
        "details": [
          {
            "label": "Avec avoir",
            "text": "Avoir à l’imparfait + participe passé",
            "examples": "j’avais fini"
          },
          {
            "label": "Avec être",
            "text": "Être à l’imparfait + participe passé",
            "examples": "j’étais arrivé"
          }
        ]
      },
      "Futur Antérieur": {
        "title": "Futur Antérieur",
        "formula": "Auxiliaire (avoir/être) au futur simple + participe passé",
        "description": "Temps exprimant une action achevée avant une autre action future.",
        "example": "J’aurai parlé, je serai parti",
        "details": [
          {
            "label": "Avec avoir",
            "text": "Avoir au futur simple + participe passé",
            "examples": "j’aurai fini"
          },
          {
            "label": "Avec être",
            "text": "Être au futur simple + participe passé",
            "examples": "je serai venu"
          }
        ]
      },
      "Passé Antérieur": {
        "title": "Passé Antérieur",
        "formula": "Auxiliaire (avoir/être) au passé simple + participe passé",
        "description": "Temps littéraire exprimant une action achevée immédiatement avant une autre action passée.",
        "example": "J’eus parlé, je fus parti",
        "details": [
          {
            "label": "Usage",
            "text": "Employé exclusivement dans la langue écrite et littéraire",
            "examples": "il eut fini"
          }
        ]
      },
      "Conditionnel Passé": {
        "title": "Conditionnel Passé",
        "formula": "Auxiliaire (avoir/être) au conditionnel présent + participe passé",
        "description": "Temps pour exprimer une action hypothétique non réalisée dans le passé.",
        "example": "J’aurais parlé, je serais parti",
        "details": [
          {
            "label": "Avec avoir",
            "text": "Avoir au conditionnel présent + participe passé",
            "examples": "j’aurais fini"
          },
          {
            "label": "Avec être",
            "text": "Être au conditionnel présent + participe passé",
            "examples": "je serais venu"
          }
        ]
      },
      "Subjonctif Passé": {
        "title": "Subjonctif Passé",
        "formula": "Auxiliaire (avoir/être) au subjonctif présent + participe passé",
        "description": "Temps exprimant une action achevée liée à une expression de doute ou de sentiment.",
        "example": "Que j’aie parlé, que je sois parti",
        "details": [
          {
            "label": "Avec avoir",
            "text": "Avoir au subjonctif présent + participe passé",
            "examples": "que j’aie fini"
          },
          {
            "label": "Avec être",
            "text": "Être au subjonctif présent + participe passé",
            "examples": "que je sois venu"
          }
        ]
      },
      "Subjonctif Plus-que-parfait": {
        "title": "Subjonctif Plus-que-parfait",
        "formula": "Auxiliaire (avoir/être) au subjonctif imparfait + participe passé",
        "description": "Temps littéraire exprimant une action achevée et incertaine dans le passé.",
        "example": "Que j’eusse parlé, que je fusse parti",
        "details": [
          {
            "label": "Usage",
            "text": "Employé uniquement dans la langue écrite et littéraire",
            "examples": "qu’il eût fini"
          }
        ]
      }
    }
  },
  en: {
    ui: {
      title: "ConjuPuzzle",
      score: "Score",
      settings: "Settings",
      rules: "Conjugasion Rules",
      about: "About",
      objective: "Goal",
      hint: "Hint",
      stem_zone: "Base",
      ending_zone: "Fin",
      stems_tray: "Base",
      endings_tray: "Fin",
      check: "Check",
      skip: "Skip",
      next: "Next",
      loading: "Loading...",
      error_title: "Error",
      error_desc: "Data error.",
      retry: "Retry",
      correct: "Correct!",
      wrong: "Try again.",
      explanation: "Note",
      filter_title: "Tenses",
      filter_desc: "Select tenses.",
      Detail: "Details",
      select_all: "All",
      deselect_all: "None",
      cancel: "Cancel",
      validate: "OK",
      regular: "Regular",
      irregular: "Irregular",
      about_desc: "ConjuPuzzle helps learners master French verb conjugation by assembling bases and endings",
      author: "Created By",
      version: "v1.0.0",
      how_to_title: "How to play",
      step_1_title: "Read the objective",
      step_1_desc: "The top panel shows the pronoun, verb, and tense.",
      step_2_title: "Build the form",
      step_2_desc: "French conjugation is usually built from: Base + Ending.",
      step_3_title: "Drag & Drop",
      step_3_desc: "Choose pieces from the tray and drop them into the slots.",
      step_4_title: "Verify",
      step_4_desc: "Click check to see if you are right!",
      // Tutorial
      tour_prev: "Back",
      tour_next: "Next",
      tour_finish: "Got it!",
      tour_obj_title: "The Goal",
      tour_obj_desc: "This is the verb and tense you need to conjugate.",
      tour_tray_title: "The Pieces",
      tour_tray_desc: "Find the correct parts (Base & Ending) in this tray.",
      tour_zone_title: "Assembly",
      tour_zone_desc: "Drag or Click the pieces here to build the word.",
      tour_settings_title: "Settings",
      tour_settings_desc: "Change tenses (Present, Future...) here.",
      tour_lang_title: "Language",
      tour_lang_desc: "Switch the interface language here.",
      tour_grammar_title: "Grammar Help",
      tour_grammar_desc: "Stuck? Click this book icon to see all conjugation rules.",
      // Onboarding Modal
      welcome_title: "Welcome to Conjugation Puzzle",
      welcome_subtitle: "Master French conjugation the fun way.",
      onboarding_logic_title: "The Logic",
      onboarding_logic_desc: "Most verbs follow this pattern: Base + Ending.",
      onboarding_action_title: "Your Mission",
      onboarding_action_desc: "Drag or Click pieces from the tray to the empty slots to build the conjugated verb.",
      start_game: "Start Game",
      restart_tutorial: "Restart Tutorial"
    },
    tenses: {
      "Présent": "Present",
      "Imparfait": "Imperfect",
      "Futur Simple": "Future",
      "Passé Simple": "Past Historic",
      "Conditionnel Présent": "Conditional",
      "Subjonctif Présent": "Subjunctive",
      "Subjonctif Imparfait": "Subj. Imperfect",
      "Passé Composé": "Compound Past",
      "Plus-que-parfait": "Pluperfect",
      "Futur Antérieur": "Future Perfect",
      "Passé Antérieur": "Past Anterior",
      "Conditionnel Passé": "Conditional Past",
      "Subjonctif Passé": "Subj. Past",
      "Subjonctif Plus-que-parfait": "Subj. Pluperfect"
    },
    rules:{
      "Présent": {
        "title": "Present Indicative",
        "formula": "Infinitive base + present tense endings (3 verb groups)",
        "description": "Used to express a current action, a habitual action, or a general truth.",
        "example": "Je parle, je finis, je prends",
        "details": [
          {
            "label": "First group verbs (-er)",
            "text": "Remove -er from the infinitive, add e, es, e, ons, ez, ent",
            "examples": "je parle, nous parlons"
          },
          {
            "label": "Second group verbs (-ir)",
            "text": "Remove -ir from the infinitive, add is, is, it, issons, issez, issent",
            "examples": "je finis, nous finissons"
          },
          {
            "label": "Third group verbs",
            "text": "Irregular bases and endings depending on the verb",
            "examples": "je prends, nous venons"
          }
        ]
      },
      "Imparfait": {
        "title": "Imperfect Indicative",
        "formula": "Present tense nous form minus -ons + imperfect endings",
        "description": "Used to describe habitual actions, background descriptions, or ongoing actions in the past.",
        "example": "Je parlais, je finissais, je prenais",
        "details": [
          {
            "label": "Basic formation",
            "text": "Take the first person plural present form, remove -ons, add ais, ais, ait, ions, iez, aient",
            "examples": "nous parlons → je parlais"
          }
        ]
      },
      "Futur Simple": {
        "title": "Simple Future",
        "formula": "Infinitive + simple future endings",
        "description": "Used to express future actions or certainty about the future.",
        "example": "Je parlerai, je finirai, je prendrai",
        "details": [
          {
            "label": "Basic formation",
            "text": "Infinitive or irregular future base + ai, as, a, ons, ez, ont",
            "examples": "parler → je parlerai"
          }
        ]
      },
      "Passé Simple": {
        "title": "Simple Past Indicative",
        "formula": "base + simple past endings",
        "description": "A literary tense used in written narratives to express completed past actions.",
        "example": "Je parlai, je finis, je pris",
        "details": [
          {
            "label": "Usage",
            "text": "Used mainly in literature, narratives, and formal written texts",
            "examples": "il entra, ils partirent"
          }
        ]
      },
      "Conditionnel Présent": {
        "title": "Present Conditional",
        "formula": "Future base + imperfect endings",
        "description": "Used to express hypotheses, conditional results, assumptions, or polite requests.",
        "example": "Je parlerais, je finirais, je prendrais",
        "details": [
          {
            "label": "Basic formation",
            "text": "Infinitive or future base + ais, ais, ait, ions, iez, aient",
            "examples": "venir → je viendrais"
          }
        ]
      },
      "Subjonctif Présent": {
        "title": "Present Subjunctive",
        "formula": "Present tense ils form minus -ent + subjunctive endings",
        "description": "Used to express doubt, subjectivity, emotion, desire, or necessity.",
        "example": "Que je parle, que je finisse, que je prenne",
        "details": [
          {
            "label": "Basic formation",
            "text": "Take the third person plural present form, remove -ent, add e, es, e, ions, iez, ent",
            "examples": "ils parlent → que je parle"
          }
        ]
      },
      "Subjonctif Imparfait": {
        "title": "Imperfect Subjunctive",
        "formula": "Simple past base + imperfect subjunctive endings",
        "description": "A literary tense used in writing to express uncertainty or subjectivity in the past.",
        "example": "Que je parlasse, que je finisse, que je prisse",
        "details": [
          {
            "label": "Usage",
            "text": "Used only in literary and formal written French, not in modern spoken language",
            "examples": "qu’il vînt, qu’ils eussent"
          }
        ]
      },
      "Passé Composé": {
        "title": "Compound Past",
        "formula": "Auxiliary avoir / être in the present + past participle",
        "description": "Used to express a completed past action with relevance to the present.",
        "example": "J’ai parlé, je suis allé",
        "details": [
          {
            "label": "Using avoir",
            "text": "Used with most transitive and intransitive verbs; the past participle usually does not agree with the subject",
            "examples": "j’ai fini"
          },
          {
            "label": "Using être",
            "text": "Used with movement and state-change verbs and all reflexive verbs; the past participle agrees with the subject",
            "examples": "je suis venu"
          }
        ]
      },
      "Plus-que-parfait": {
        "title": "Pluperfect Indicative",
        "formula": "Auxiliary avoir / être in the imperfect + past participle",
        "description": "Used to express an action completed before another past action.",
        "example": "J’avais parlé, j’étais parti",
        "details": [
          {
            "label": "Using avoir",
            "text": "Used with most verbs, following the same rules as the compound past with avoir",
            "examples": "j’avais fini"
          },
          {
            "label": "Using être",
            "text": "Used with movement and reflexive verbs; the past participle agrees with the subject",
            "examples": "j’étais arrivé"
          }
        ]
      },
      "Futur Antérieur": {
        "title": "Future Perfect",
        "formula": "Auxiliary avoir / être in the simple future + past participle",
        "description": "Used to express an action that will be completed before a future moment.",
        "example": "J’aurai parlé, je serai parti",
        "details": [
          {
            "label": "Using avoir",
            "text": "Used with most verbs, following the same rules as the compound past with avoir",
            "examples": "j’aurai fini"
          },
          {
            "label": "Using être",
            "text": "Used with movement and reflexive verbs; the past participle agrees with the subject",
            "examples": "je serai venu"
          }
        ]
      },
      "Passé Antérieur": {
        "title": "Past Anterior",
        "formula": "Auxiliary avoir / être in the simple past + past participle",
        "description": "A literary tense expressing an action completed immediately before another past action.",
        "example": "J’eus parlé, je fus parti",
        "details": [
          {
            "label": "Using avoir",
            "text": "Used with most verbs, following the same rules as the compound past with avoir; literary usage only",
            "examples": "il eut fini"
          },
          {
            "label": "Using être",
            "text": "Used with movement and reflexive verbs; past participle agrees with the subject; literary usage only",
            "examples": "il fut venu"
          }
        ]
      },
      "Conditionnel Passé": {
        "title": "Past Conditional",
        "formula": "Auxiliary avoir / être in the present conditional + past participle",
        "description": "Used to express an unrealized or hypothetical action in the past.",
        "example": "J’aurais parlé, je serais parti",
        "details": [
          {
            "label": "Using avoir",
            "text": "Used with most verbs to express an action that would have occurred under certain conditions",
            "examples": "j’aurais fini"
          },
          {
            "label": "Using être",
            "text": "Used with movement and reflexive verbs; the past participle agrees with the subject",
            "examples": "je serais venu"
          }
        ]
      },
      "Subjonctif Passé": {
        "title": "Past Subjunctive",
        "formula": "Auxiliary avoir / être in the present subjunctive + past participle",
        "description": "Used to express a completed action linked to doubt, emotion, or subjectivity.",
        "example": "Que j’aie parlé, que je sois parti",
        "details": [
          {
            "label": "Using avoir",
            "text": "Used with most verbs to express a completed action in a subjunctive context",
            "examples": "que j’aie fini"
          },
          {
            "label": "Using être",
            "text": "Used with movement and reflexive verbs; the past participle agrees with the subject",
            "examples": "que je sois venu"
          }
        ]
      },
      "Subjonctif Plus-que-parfait": {
        "title": "Pluperfect Subjunctive",
        "formula": "Auxiliary avoir / être in the imperfect subjunctive + past participle",
        "description": "A literary tense used to express a completed action in the past with a hypothetical or subjective nuance.",
        "example": "Que j’eusse parlé, que je fusse parti",
        "details": [
          {
            "label": "Using avoir",
            "text": "Used with most verbs; follows the same rules as the past subjunctive; literary usage only",
            "examples": "qu’il eût fini"
          },
          {
            "label": "Using être",
            "text": "Used with movement and reflexive verbs; the past participle agrees with the subject; literary usage only",
            "examples": "qu’il fût venu"
          }
        ]
      }
    }

  },
  zh: {
    ui: {
      title: "ConjuPuzzle",
      score: "得分",
      settings: "设置",
      rules: "动词变位规则",
      about: "关于",
      objective: "目标",
      hint: "提示",
      stem_zone: "Base",
      ending_zone: "Fin",
      stems_tray: "Base",
      endings_tray: "Fin",
      check: "检查",
      skip: "跳过",
      next: "下一题",
      loading: "加载中...",
      error_title: "错误",
      error_desc: "加载失败",
      retry: "重试",
      correct: "正确！",
      wrong: "再试一次",
      explanation: "解析",
      filter_title: "时态",
      filter_desc: "选择练习时态",
      Detail: "详细",
      select_all: "全选",
      deselect_all: "全不选",
      cancel: "取消",
      validate: "确认",
      regular: "规则",
      irregular: "不规则",
      about_desc: "ConjuPuzzle 通过拼接动词词根与词尾的方式，引导学习者练习并掌握法语动词变位",
      author: "Created By",
      version: "v1.0.0",
      how_to_title: "如何使用",
      step_1_title: "阅读目标",
      step_1_desc: "顶部面板显示代词、动词和目标时态",
      step_2_title: "理解逻辑",
      step_2_desc: "法语变位通常由 “词干 (Base) + 词尾 (Fin)” 组成",
      step_3_title: "拖拽拼图",
      step_3_desc: "从下方托盘选择正确的拼图块，拖入中间的空槽",
      step_4_title: "验证答案",
      step_4_desc: "点击检查按钮，系统会验证你的组合是否正确！",
      // Tutorial
      tour_prev: "上一步",
      tour_next: "下一步",
      tour_finish: "知道了",
      tour_obj_title: "当前目标",
      tour_obj_desc: "这里显示需要变位的 人称代词 + 动词 + 时态",
      tour_tray_title: "拼图碎片",
      tour_tray_desc: "在下方区域找到正确的词干 (Base)和【词尾 (Fin)",
      tour_zone_title: "拼装区域",
      tour_zone_desc: "将碎片拖拽到这里，像拼图一样组合它们。",
      tour_settings_title: "时态设置",
      tour_settings_desc: "在此处筛选你想练习的时态（如：只练直陈式）。",
      tour_lang_title: "语言切换",
      tour_lang_desc: "在此处切换界面语言。",
      tour_grammar_title: "语法宝典",
      tour_grammar_desc: "忘记规则了？点击这本“书”查看所有变位规则。",
      // Onboarding Modal
      welcome_title: "欢迎来到法语变位拼图",
      welcome_subtitle: "通过拼图方式轻松掌握法语动词变位规律。",
      onboarding_logic_title: "核心逻辑",
      onboarding_logic_desc: "大多数动词遵循此规律：词干 + 词尾。",
      onboarding_action_title: "你的任务",
      onboarding_action_desc: "将碎片拖入空槽，拼出正确的动词变位形式。",
      start_game: "开始游戏",
      restart_tutorial: "重看教程"
    },
    tenses: {
      "Présent": "直陈式现在时",
      "Imparfait": "未完成过去时",
      "Futur Simple": "简单将来时",
      "Passé Simple": "简单过去时",
      "Conditionnel Présent": "条件式现在时",
      "Subjonctif Présent": "虚拟式现在时",
      "Subjonctif Imparfait": "虚拟式未完成",
      "Passé Composé": "复合过去时",
      "Plus-que-parfait": "愈过去时",
      "Futur Antérieur": "先将来时",
      "Passé Antérieur": "先过去时",
      "Conditionnel Passé": "条件式过去时",
      "Subjonctif Passé": "虚拟式过去时",
      "Subjonctif Plus-que-parfait": "虚拟式愈过去"
    },
    rules:{    
      "Présent": {
        "title": "直陈式现在时",
        "formula": "不定式词干 + 现在时变位词尾（3 个变位组）",
        "description": "用于表达当前正在发生的动作、习惯性动作或客观事实。",
        "example": "Je parle, je finis, je prends",
        "details": [
          {
            "label": "第一组动词（-er）",
            "text": "去掉不定式词尾 -er，加 e, es, e, ons, ez, ent",
            "examples": "je parle, nous parlons"
          },
          {
            "label": "第二组动词（-ir）",
            "text": "去掉不定式词尾 -ir，加 is, is, it, issons, issez, issent",
            "examples": "je finis, nous finissons"
          },
          {
            "label": "第三组动词",
            "text": "词干和词尾变化不规则，需单独记忆",
            "examples": "je prends, nous venons"
          }
        ]
      },
      "Imparfait": {
        "title": "直陈式未完成过去时",
        "formula": "现在时 nous 形式去掉 -ons + 未完成过去时词尾",
        "description": "用于描述过去经常发生的动作、背景性描述或过去某一时刻正在进行的动作。",
        "example": "Je parlais, je finissais, je prenais",
        "details": [
          {
            "label": "基本构成",
            "text": "现在时第一人称复数形式去掉 -ons，加 ais, ais, ait, ions, iez, aient",
            "examples": "nous parlons → je parlais"
          }
        ]
      },
      "Futur Simple": {
        "title": "直陈式简单将来时",
        "formula": "不定式 + 简单将来时词尾",
        "description": "用于表达将来要发生的动作或对未来的确定判断。",
        "example": "Je parlerai, je finirai, je prendrai",
        "details": [
          {
            "label": "基本构成",
            "text": "不定式或不规则将来词干 + ai, as, a, ons, ez, ont",
            "examples": "parler → je parlerai"
          }
        ]
      },
      "Passé Simple": {
        "title": "直陈式简单过去时",
        "formula": "词干 + 简单过去时词尾",
        "description": "文学性时态，用于书面语中表达一次性、已完成的过去动作。",
        "example": "Je parlai, je finis, je pris",
        "details": [
          {
            "label": "使用场景",
            "text": "主要用于文学作品、叙事文本和正式书面语",
            "examples": "il entra, ils partirent"
          }
        ]
      },
      "Conditionnel Présent": {
        "title": "条件式现在时",
        "formula": "将来时词干 + 未完成过去时词尾",
        "description": "用于表达假设、条件结果、推测或礼貌请求。",
        "example": "Je parlerais, je finirais, je prendrais",
        "details": [
          {
            "label": "基本构成",
            "text": "不定式或将来时词干 + ais, ais, ait, ions, iez, aient",
            "examples": "venir → je viendrais"
          }
        ]
      },
      "Subjonctif Présent": {
        "title": "虚拟式现在时",
        "formula": "现在时 ils 形式去掉 -ent + 虚拟式词尾",
        "description": "用于表达不确定性、主观判断、情感、愿望或必要性。",
        "example": "Que je parle, que je finisse, que je prenne",
        "details": [
          {
            "label": "基本构成",
            "text": "现在时第三人称复数形式去掉 -ent，加 e, es, e, ions, iez, ent",
            "examples": "ils parlent → que je parle"
          }
        ]
      },
      "Subjonctif Imparfait": {
        "title": "虚拟式未完成过去时",
        "formula": "简单过去时词干 + 虚拟式未完成过去时词尾",
        "description": "文学性时态，用于书面语中表达过去的不确定或主观动作。",
        "example": "Que je parlasse, que je finisse, que je prisse",
        "details": [
          {
            "label": "使用场景",
            "text": "仅用于文学和正式书面语，现代口语中已不使用",
            "examples": "qu’il vînt, qu’ils eussent"
          }
        ]
      },
      "Passé Composé": {
        "title": "复合过去时",
        "formula": "助动词 avoir / être 现在时 + 过去分词",
        "description": "用于表达已经完成且与现在有关联的过去动作。",
        "example": "J’ai parlé, je suis allé",
        "details": [
          {
            "label": "使用 avoir",
            "text": "用于大多数及物动词和不及物动词，动词后可直接接宾语；过去分词通常不与主语配合",
            "examples": "j’ai fini"
          },
          {
            "label": "使用 être",
            "text": "用于 16 个运动和状态变化动词及所有自反动词，过去分词需与主语进行性数配合",
            "examples": "je suis venu"
          }
        ]
      },
      "Plus-que-parfait": {
        "title": "直陈式愈过去时",
        "formula": "助动词 avoir / être 未完成过去时 + 过去分词",
        "description": "用于表达在另一过去动作之前已经完成的动作。",
        "example": "J’avais parlé, j’étais parti",
        "details": [
          {
            "label": "使用 avoir",
            "text": "用于大多数动词，规则与复合过去时中使用 avoir 相同",
            "examples": "j’avais fini"
          },
          {
            "label": "使用 être",
            "text": "用于运动动词和自反动词，过去分词与主语进行性数配合",
            "examples": "j’étais arrivé"
          }
        ]
      },
      "Futur Antérieur": {
        "title": "先将来时",
        "formula": "助动词 avoir / être 简单将来时 + 过去分词",
        "description": "用于表达在未来某一时刻之前已经完成的动作。",
        "example": "J’aurai parlé, je serai parti",
        "details": [
          {
            "label": "使用 avoir",
            "text": "用于大多数动词，规则与复合过去时中使用 avoir 相同",
            "examples": "j’aurai fini"
          },
          {
            "label": "使用 être",
            "text": "用于运动动词和自反动词，过去分词与主语进行性数配合",
            "examples": "je serai venu"
          }
        ]
      },
      "Passé Antérieur": {
        "title": "直陈式先过去时",
        "formula": "助动词 avoir / être 简单过去时 + 过去分词",
        "description": "文学性时态，用于书面语中表示紧接另一过去动作之前完成的动作。",
        "example": "J’eus parlé, je fus parti",
        "details": [
          {
            "label": "使用 avoir",
            "text": "用于大多数动词，规则与复合过去时中使用 avoir 相同，仅见于书面语",
            "examples": "il eut fini"
          },
          {
            "label": "使用 être",
            "text": "用于运动动词和自反动词，过去分词与主语进行性数配合，仅用于文学语境",
            "examples": "il fut venu"
          }
        ]
      },
      "Conditionnel Passé": {
        "title": "条件式过去时",
        "formula": "助动词 avoir / être 条件式现在时 + 过去分词",
        "description": "用于表达过去未实现的假设或条件结果。",
        "example": "J’aurais parlé, je serais parti",
        "details": [
          {
            "label": "使用 avoir",
            "text": "用于大多数动词，表示假设条件下本应完成的动作",
            "examples": "j’aurais fini"
          },
          {
            "label": "使用 être",
            "text": "用于运动动词和自反动词，过去分词与主语进行性数配合",
            "examples": "je serais venu"
          }
        ]
      },
      "Subjonctif Passé": {
        "title": "虚拟式过去时",
        "formula": "助动词 avoir / être 虚拟式现在时 + 过去分词",
        "description": "用于表达已经完成但带有主观判断、情感或不确定性的动作。",
        "example": "Que j’aie parlé, que je sois parti",
        "details": [
          {
            "label": "使用 avoir",
            "text": "用于大多数动词，表示在虚拟语境下已完成的动作",
            "examples": "que j’aie fini"
          },
          {
            "label": "使用 être",
            "text": "用于运动动词和自反动词，过去分词与主语进行性数配合",
            "examples": "que je sois venu"
          }
        ]
      },
      "Subjonctif Plus-que-parfait": {
        "title": "虚拟式愈过去时",
        "formula": "助动词 avoir / être 虚拟式未完成过去时 + 过去分词",
        "description": "文学性时态，用于书面语中表达过去已完成但带有主观或假设色彩的动作。",
        "example": "Que j’eusse parlé, que je fusse parti",
        "details": [
          {
            "label": "使用 avoir",
            "text": "用于大多数动词，规则与虚拟式过去时中使用 avoir 相同，仅用于文学语境",
            "examples": "qu’il eût fini"
          },
          {
            "label": "使用 être",
            "text": "用于运动动词和自反动词，过去分词与主语进行性数配合，仅用于文学语境",
            "examples": "qu’il fût venu"
          }
        ]
      }    
    }
  },
  ja: {
    ui: {
      title: "ConjuPuzzle",
      score: "点数",
      settings: "設定",
      rules: "規則",
      about: "概要",
      objective: "目標",
      hint: "ヒント",
      stem_zone: "Base",
      ending_zone: "Fin",
      stems_tray: "Base",
      endings_tray: "Fin",
      check: "判定",
      skip: "パス",
      next: "次へ",
      loading: "読込中...",
      error_title: "エラー",
      error_desc: "通信エラー",
      retry: "再試行",
      correct: "正解！",
      wrong: "不正解",
      explanation: "解説",
      filter_title: "時制設定",
      filter_desc: "練習する時制を選択",
      Detail: "詳細",
      select_all: "全選択",
      deselect_all: "全解除",
      cancel: "取消",
      validate: "決定",
      regular: "規則",
      irregular: "不規則",
      about_desc: "ConjuPuzzle は、語幹と語尾を組み合わせてフランス語の動詞活用習得を支援します",
      author: "Created By",
      version: "v1.0.0",
      how_to_title: "遊び方",
      step_1_title: "お題を読む",
      step_1_desc: "上部に代名詞、動詞、時制が表示されます。",
      step_2_title: "ロジック",
      step_2_desc: "フランス語の動詞は基本的に「語幹(Base) + 語尾(Fin)」で作られます。",
      step_3_title: "ドラッグ＆ドロップ",
      step_3_desc: "下のトレイからピースを選んで、空のスロットに配置します。",
      step_4_title: "答え合わせ",
      step_4_desc: "判定ボタンを押して、正解かどうか確認しましょう！",
      // Tutorial
      tour_prev: "戻る",
      tour_next: "次へ",
      tour_finish: "完了",
      tour_obj_title: "ミッション",
      tour_obj_desc: "代名詞・動詞・時制を確認してください。",
      tour_tray_title: "ピース",
      tour_tray_desc: "ここから正しい【語幹】と【語尾】を見つけましょう。",
      tour_zone_title: "組み立て",
      tour_zone_desc: "ここにピースをドラッグして活用を完成させます。",
      tour_settings_title: "時制設定",
      tour_settings_desc: "練習したい時制（現在形など）を変更できます。",
      tour_lang_title: "言語切替",
      tour_lang_desc: "表示言語を変更できます。",
      tour_grammar_title: "文法ガイド",
      tour_grammar_desc: "ルールを忘れた？この本アイコンで活用ルールを確認できます。",
      // Onboarding Modal
      welcome_title: "活用パズルへようこそ",
      welcome_subtitle: "ゲーム感覚でフランス語の活用をマスターしよう。",
      onboarding_logic_title: "ロジック",
      onboarding_logic_desc: "多くの動詞は「語幹 + 語尾」のパターンで作られます。",
      onboarding_action_title: "ミッション",
      onboarding_action_desc: "ピースを空のスロットにドラッグして、活用形を完成させましょう。",
      start_game: "ゲームスタート",
      restart_tutorial: "チュートリアルを再開"
    },
    tenses: {
      "Présent": "現在形",
      "Imparfait": "半過去",
      "Futur Simple": "単純未来",
      "Passé Simple": "単純過去",
      "Conditionnel Présent": "条件法現在",
      "Subjonctif Présent": "接続法現在",
      "Subjonctif Imparfait": "接続法半過去",
      "Passé Composé": "複合過去",
      "Plus-que-parfait": "大過去",
      "Futur Antérieur": "前未来",
      "Passé Antérieur": "前過去",
      "Conditionnel Passé": "条件法過去",
      "Subjonctif Passé": "接続法過去",
      "Subjonctif Plus-que-parfait": "接続法大過去"
    },
    rules:{
      "Présent": {
        "title": "直説法現在形",
        "formula": "不定詞の語幹 + 現在形の語尾（3動詞群）",
        "description": "現在行われている動作、習慣的な動作、または一般的な事実を表す。",
        "example": "Je parle, je finis, je prends",
        "details": [
          {
            "label": "第1群動詞（-er）",
            "text": "不定詞から -er を取り除き、e, es, e, ons, ez, ent を付ける",
            "examples": "je parle, nous parlons"
          },
          {
            "label": "第2群動詞（-ir）",
            "text": "不定詞から -ir を取り除き、is, is, it, issons, issez, issent を付ける",
            "examples": "je finis, nous finissons"
          },
          {
            "label": "第3群動詞",
            "text": "動詞ごとに語幹や語尾が不規則に変化する",
            "examples": "je prends, nous venons"
          }
        ]
      },
      "Imparfait": {
        "title": "直説法半過去",
        "formula": "現在形 nous 形 − ons + 半過去の語尾",
        "description": "過去の習慣的動作、背景描写、または過去のある時点で進行中だった動作を表す。",
        "example": "Je parlais, je finissais, je prenais",
        "details": [
          {
            "label": "基本構成",
            "text": "現在形1人称複数から -ons を除き、ais, ais, ait, ions, iez, aient を付ける",
            "examples": "nous parlons → je parlais"
          }
        ]
      },
      "Futur Simple": {
        "title": "直説法単純未来",
        "formula": "不定詞 + 単純未来の語尾",
        "description": "将来起こる動作や、未来に対する確実な判断を表す。",
        "example": "Je parlerai, je finirai, je prendrai",
        "details": [
          {
            "label": "基本構成",
            "text": "不定詞または不規則な未来語幹 + ai, as, a, ons, ez, ont",
            "examples": "parler → je parlerai"
          }
        ]
      },
      "Passé Simple": {
        "title": "直説法単純過去",
        "formula": "語幹 + 単純過去の語尾",
        "description": "文学的時制で、書き言葉において完結した過去の動作を表す。",
        "example": "Je parlai, je finis, je pris",
        "details": [
          {
            "label": "用法",
            "text": "主に文学作品、物語文、正式な書き言葉で使用される",
            "examples": "il entra, ils partirent"
          }
        ]
      },
      "Conditionnel Présent": {
        "title": "条件法現在",
        "formula": "未来形の語幹 + 半過去の語尾",
        "description": "仮定、条件の結果、推量、丁寧な依頼を表す。",
        "example": "Je parlerais, je finirais, je prendrais",
        "details": [
          {
            "label": "基本構成",
            "text": "不定詞または未来語幹 + ais, ais, ait, ions, iez, aient",
            "examples": "venir → je viendrais"
          }
        ]
      },
      "Subjonctif Présent": {
        "title": "接続法現在",
        "formula": "現在形 ils 形 − ent + 接続法の語尾",
        "description": "疑い、主観、感情、願望、必要性を表す。",
        "example": "Que je parle, que je finisse, que je prenne",
        "details": [
          {
            "label": "基本構成",
            "text": "現在形3人称複数から -ent を除き、e, es, e, ions, iez, ent を付ける",
            "examples": "ils parlent → que je parle"
          }
        ]
      },
      "Subjonctif Imparfait": {
        "title": "接続法半過去",
        "formula": "単純過去の語幹 + 接続法半過去の語尾",
        "description": "文学的時制で、過去における不確実または主観的な動作を表す。",
        "example": "Que je parlasse, que je finisse, que je prisse",
        "details": [
          {
            "label": "用法",
            "text": "文学的・正式な書き言葉のみで使用され、現代口語では使われない",
            "examples": "qu’il vînt, qu’ils eussent"
          }
        ]
      },
      "Passé Composé": {
        "title": "複合過去",
        "formula": "助動詞 avoir / être 現在形 + 過去分詞",
        "description": "完了した過去の動作で、現在と関連性のあるものを表す。",
        "example": "J’ai parlé, je suis allé",
        "details": [
          {
            "label": "avoir を使用",
            "text": "ほとんどの動詞で使用される。通常、過去分詞は主語と一致しない",
            "examples": "j’ai fini"
          },
          {
            "label": "être を使用",
            "text": "移動・状態変化動詞およびすべての再帰動詞で使用され、過去分詞は主語と性・数一致する",
            "examples": "je suis venu"
          }
        ]
      },
      "Plus-que-parfait": {
        "title": "直説法大過去",
        "formula": "助動詞 avoir / être 半過去 + 過去分詞",
        "description": "他の過去の動作よりも前に完了した動作を表す。",
        "example": "J’avais parlé, j’étais parti",
        "details": [
          {
            "label": "avoir を使用",
            "text": "複合過去における avoir の用法と同じ規則で使用される",
            "examples": "j’avais fini"
          },
          {
            "label": "être を使用",
            "text": "移動動詞・再帰動詞で使用され、過去分詞は主語と一致する",
            "examples": "j’étais arrivé"
          }
        ]
      },
      "Futur Antérieur": {
        "title": "前未来",
        "formula": "助動詞 avoir / être 単純未来 + 過去分詞",
        "description": "未来のある時点より前に完了する動作を表す。",
        "example": "J’aurai parlé, je serai parti",
        "details": [
          {
            "label": "avoir を使用",
            "text": "複合過去と同様に、大部分の動詞で使用される",
            "examples": "j’aurai fini"
          },
          {
            "label": "être を使用",
            "text": "移動動詞・再帰動詞で使用され、過去分詞は主語と一致する",
            "examples": "je serai venu"
          }
        ]
      },
      "Passé Antérieur": {
        "title": "直説法前過去",
        "formula": "助動詞 avoir / être 単純過去 + 過去分詞",
        "description": "文学的時制で、別の過去動作の直前に完了した動作を表す。",
        "example": "J’eus parlé, je fus parti",
        "details": [
          {
            "label": "avoir を使用",
            "text": "大部分の動詞で使用され、文学的文脈に限定される",
            "examples": "il eut fini"
          },
          {
            "label": "être を使用",
            "text": "移動動詞・再帰動詞で使用され、過去分詞は主語と一致する。文学語のみ",
            "examples": "il fut venu"
          }
        ]
      },
      "Conditionnel Passé": {
        "title": "条件法過去",
        "formula": "助動詞 avoir / être 条件法現在 + 過去分詞",
        "description": "過去において実現しなかった仮定や条件の結果を表す。",
        "example": "J’aurais parlé, je serais parti",
        "details": [
          {
            "label": "avoir を使用",
            "text": "条件が満たされていれば起こったはずの動作を表す",
            "examples": "j’aurais fini"
          },
          {
            "label": "être を使用",
            "text": "移動動詞・再帰動詞で使用され、過去分詞は主語と一致する",
            "examples": "je serais venu"
          }
        ]
      },
      "Subjonctif Passé": {
        "title": "接続法過去",
        "formula": "助動詞 avoir / être 接続法現在 + 過去分詞",
        "description": "疑い・感情・主観を伴う文脈で、すでに完了した動作を表す。",
        "example": "Que j’aie parlé, que je sois parti",
        "details": [
          {
            "label": "avoir を使用",
            "text": "接続法の文脈で完了した動作を表す際に使用される",
            "examples": "que j’aie fini"
          },
          {
            "label": "être を使用",
            "text": "移動動詞・再帰動詞で使用され、過去分詞は主語と一致する",
            "examples": "que je sois venu"
          }
        ]
      },
      "Subjonctif Plus-que-parfait": {
        "title": "接続法大過去",
        "formula": "助動詞 avoir / être 接続法半過去 + 過去分詞",
        "description": "文学的時制で、過去に完了した仮定的・主観的な動作を表す。",
        "example": "Que j’eusse parlé, que je fusse parti",
        "details": [
          {
            "label": "avoir を使用",
            "text": "接続法過去と同様の規則で使用され、文学語に限定される",
            "examples": "qu’il eût fini"
          },
          {
            "label": "être を使用",
            "text": "移動動詞・再帰動詞で使用され、過去分詞は主語と一致する。文学語のみ",
            "examples": "qu’il fût venu"
          }
        ]
      }
    }

  }
};
