CREATE OR REPLACE TRIGGER conversation_changes_set_updated_at
    BEFORE INSERT OR UPDATE 
    ON public.conversation_changes
    FOR EACH ROW 
    EXECUTE FUNCTION public.trigger_set_updated_at();

CREATE OR REPLACE TRIGGER deal_filename_user_engagement_stats_set_updated_at
    BEFORE INSERT OR UPDATE 
    ON public.deal_filename_user_engagement_stats
    FOR EACH ROW 
    EXECUTE FUNCTION public.trigger_set_updated_at();


CREATE OR REPLACE TRIGGER deal_comments_set_updated_at
    BEFORE INSERT OR UPDATE 
    ON public.deal_comments
    FOR EACH ROW 
    EXECUTE FUNCTION public.trigger_set_updated_at();

CREATE OR REPLACE TRIGGER relationships_set_updated_at
    BEFORE INSERT OR UPDATE 
    ON public.relationships
    FOR EACH ROW 
    EXECUTE FUNCTION public.trigger_set_updated_at();

CREATE OR REPLACE TRIGGER organizations_set_updated_at
    BEFORE INSERT OR UPDATE 
    ON public.organizations
    FOR EACH ROW 
    EXECUTE FUNCTION public.trigger_set_updated_at();

CREATE OR REPLACE TRIGGER deal_faqs_set_updated_at
    BEFORE INSERT OR UPDATE 
    ON public.deal_faqs
    FOR EACH ROW 
    EXECUTE FUNCTION public.trigger_set_updated_at();

CREATE OR REPLACE TRIGGER deal_images_set_updated_at
    BEFORE INSERT OR UPDATE 
    ON public.deal_images
    FOR EACH ROW 
    EXECUTE FUNCTION public.trigger_set_updated_at();

CREATE OR REPLACE TRIGGER deal_interest_set_updated_at
    BEFORE INSERT OR UPDATE 
    ON public.deal_interest
    FOR EACH ROW 
    EXECUTE FUNCTION public.trigger_set_updated_at();

CREATE OR REPLACE TRIGGER deal_to_sponsor_associations_set_updated_at
    BEFORE INSERT OR UPDATE 
    ON public.deal_to_sponsor_associations
    FOR EACH ROW 
    EXECUTE FUNCTION public.trigger_set_updated_at();

CREATE OR REPLACE TRIGGER deal_filenames_set_updated_at
    BEFORE INSERT OR UPDATE 
    ON public.deal_filenames
    FOR EACH ROW 
    EXECUTE FUNCTION public.trigger_set_updated_at();


CREATE OR REPLACE TRIGGER endorsements_set_updated_at
    BEFORE INSERT OR UPDATE 
    ON public.endorsements
    FOR EACH ROW 
    EXECUTE FUNCTION public.trigger_set_updated_at();

CREATE OR REPLACE TRIGGER conversation_to_user_associations_set_updated_at
    BEFORE INSERT OR UPDATE 
    ON public.conversation_to_user_associations
    FOR EACH ROW 
    EXECUTE FUNCTION public.trigger_set_updated_at();


CREATE OR REPLACE TRIGGER deal_comment_likes_set_updated_at
    BEFORE INSERT OR UPDATE 
    ON public.deal_comment_likes
    FOR EACH ROW 
    EXECUTE FUNCTION public.trigger_set_updated_at();


CREATE OR REPLACE TRIGGER messages_set_updated_at
    BEFORE INSERT OR UPDATE 
    ON public.messages
    FOR EACH ROW 
    EXECUTE FUNCTION public.trigger_set_updated_at();


CREATE OR REPLACE TRIGGER connections_set_updated_at
    BEFORE INSERT OR UPDATE 
    ON public.connections
    FOR EACH ROW 
    EXECUTE FUNCTION public.trigger_set_updated_at();

CREATE OR REPLACE TRIGGER deal_attachments_set_updated_at
    BEFORE INSERT OR UPDATE 
    ON public.deal_attachments
    FOR EACH ROW 
    EXECUTE FUNCTION public.trigger_set_updated_at();


CREATE OR REPLACE TRIGGER private_notes_set_updated_at
    BEFORE INSERT OR UPDATE 
    ON public.private_notes
    FOR EACH ROW 
    EXECUTE FUNCTION public.trigger_set_updated_at();

CREATE OR REPLACE TRIGGER conversations_set_updated_at
    BEFORE INSERT OR UPDATE 
    ON public.conversations
    FOR EACH ROW 
    EXECUTE FUNCTION public.trigger_set_updated_at();

CREATE OR REPLACE TRIGGER message_read_receipts_set_updated_at
    BEFORE INSERT OR UPDATE 
    ON public.message_read_receipts
    FOR EACH ROW 
    EXECUTE FUNCTION public.trigger_set_updated_at();

