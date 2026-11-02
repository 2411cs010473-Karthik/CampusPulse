import re
MAX_LEN = 40
VOCAB_SIZE = 5000
KEYWORD_STOP = set("the a an and or but is are was were be been to of in on at for with it its this that these those i my we our you your they them their he she as by from so very really just too also not no have has had do does did can could would should will than then there here when what which who all any more most some such only own same into about over after before up out if get got one two much many make made im ive dont isnt wasnt cant campus university college students student feedback".split())

def clean_text(text):
    """Lowercase, strip URLs/digits/punctuation, collapse whitespace. Negations are kept for the LSTM."""
    t = re.sub(r"http\S+", " ", str(text).lower())
    t = re.sub(r"[^a-z\s']", " ", t)
    return re.sub(r"\s+", " ", t).strip()

def keywords(text):
    return [w for w in clean_text(text).split() if len(w) > 2 and w not in KEYWORD_STOP]
